# Mockup previews — `https://<slug>.demo.doderasoft.com`

Admin → **Mockups** lets the team create a project per lead, drop in a plain
HTML / CSS / JS mockup (a folder, loose files or a `.zip`), hit **Deploy** and
share a link. Every deploy is a new version (rollback is one click), the
project page embeds a live preview with desktop / tablet / mobile widths, and
deleting the project takes the link down immediately.

---

## How it works

| Piece | Where |
|---|---|
| Tables `mockup_projects`, `mockup_deployments`, `mockup_files` (files are `bytea`, like CVs — DB backups cover them) | `src/db/schema.ts`, `drizzle/0001_mockups.sql` |
| Upload processing (zip expansion, wrapper-folder stripping, entry detection, limits) | `src/lib/mockups.ts` |
| Admin API | `src/app/api/admin/mockups/**` |
| Admin UI | `src/app/admin/(dashboard)/mockups/**`, `src/components/admin/mockups/*` |
| Host routing: `<slug>.<MOCKUPS_DOMAIN>` → internal `/mockup-host/<slug>/…` | `src/middleware.ts` |
| Static file serving (ETag, `noindex`, `frame-ancestors` for the admin iframe) | `src/app/mockup-host/[slug]/[[...path]]/route.ts` |
| Site-wide security headers skipped on mockup hosts (evaluated at build time) | `next.config.ts` |
| Limits (500 files, 25 MB/file, 80 MB/deploy, 10 old versions kept), reserved slugs | `src/config/mockups.ts` |

Why a wildcard subdomain instead of a path like `doderasoft.com/demo/<slug>/`:
mockups use root-relative links (`/style.css`) and run arbitrary JS, so each
one gets its own origin — nothing can touch the main site or the admin
session, and links "just work".

Why a **DNS-01 wildcard certificate**: the existing `letsencrypt` resolver on
the Coolify proxy is HTTP-01, which cannot issue `*.demo.doderasoft.com`, and
Traefik does not request per-subdomain certificates on demand for a
`HostRegexp` router. One wildcard cert covers every project forever, so
creating a project needs no server access at all. The existing
`*.preview.doderasoft.com` setup (`/usr/local/bin/preview`) is untouched.

---

## One-time infrastructure setup (manual)

Server: Hetzner `178.104.121.44` (`ssh hetzner`), Coolify at `vps.doderasoft.com`,
proxy = Traefik v3.7 (`coolify-proxy`). DNS is at Hostinger.

### 1. Hostinger — DNS records

Add two **A** records on `doderasoft.com` (TTL doesn't matter):

| Type | Name | Points to |
|---|---|---|
| A | `demo` | `178.104.121.44` |
| A | `*.demo` | `178.104.121.44` |

Check: `dig +short anything.demo.doderasoft.com` → `178.104.121.44`.

### 2. Hostinger — API token

hPanel → account menu (top right) → **API** → create a token (it needs DNS
zone access). Keep it for the next step. Docs: https://developers.hostinger.com

### 3. Coolify — add a DNS-01 certificate resolver to the proxy

Coolify → **Servers → localhost → Proxy → Configuration**. Two additions to
the docker-compose shown there, then **Save** and **Restart Proxy**:

```yaml
services:
  traefik:
    # … existing keys unchanged …
    environment:
      - HOSTINGER_API_TOKEN=<the token from step 2>
      - HOSTINGER_PROPAGATION_TIMEOUT=300
      - HOSTINGER_POLLING_INTERVAL=10
    command:
      # … all existing lines unchanged, then add:
      - '--certificatesresolvers.letsencrypt-dns.acme.dnschallenge=true'
      - '--certificatesresolvers.letsencrypt-dns.acme.dnschallenge.provider=hostinger'
      - '--certificatesresolvers.letsencrypt-dns.acme.dnschallenge.propagation.delayBeforeChecks=30s'
      - '--certificatesresolvers.letsencrypt-dns.acme.storage=/traefik/acme-dns.json'
```

Traefik creates `/data/coolify/proxy/acme-dns.json` itself. The existing
`letsencrypt` (HTTP-01) resolver keeps working for everything else. Traefik
3.7 ships lego with the `hostinger` provider, so no image change is needed.

### 4. Enable the Traefik route

The route file is already on the server, disabled until the resolver exists:

```bash
ssh hetzner 'mv /data/coolify/proxy/dynamic/dodera-demos.yaml.disabled /data/coolify/proxy/dynamic/dodera-demos.yaml'
```

Traefik watches that directory, so it picks the file up within seconds and
requests the wildcard certificate. Verify:

```bash
ssh hetzner 'docker logs coolify-proxy --since 5m 2>&1 | grep -iE "acme|dodera-demos|hostinger"'
curl -sI https://anything.demo.doderasoft.com | head -3      # 404 from the app, valid TLS
```

For reference, the file content (`/data/coolify/proxy/dynamic/dodera-demos.yaml`):

```yaml
http:
  routers:
    dodera-demos-https:
      rule: 'HostRegexp(`^([a-z0-9-]+\.)?demo\.doderasoft\.com$`)'
      entryPoints: [https]
      middlewares: [gzip]
      service: https-0-q1on6q58q0nkmyhgij6k9xgf@docker   # dodera-nextjs (Coolify app uuid)
      tls:
        certresolver: letsencrypt-dns
        domains:
          - main: demo.doderasoft.com
            sans: ['*.demo.doderasoft.com']
    dodera-demos-http:
      rule: 'HostRegexp(`^([a-z0-9-]+\.)?demo\.doderasoft\.com$`)'
      entryPoints: [http]
      middlewares: [redirect-to-https]
      service: http-0-q1on6q58q0nkmyhgij6k9xgf@docker
```

`https-0-<uuid>@docker` is the service Coolify generates from the app's
first domain, so it survives redeploys. If the app is ever re-created in
Coolify (new UUID) or its domain order changes, update the two `service:` lines.

### 5. Coolify — app environment variable

dodera-nextjs → **Environment Variables**:

- `MOCKUPS_DOMAIN=demo.doderasoft.com` — tick **Available at Buildtime**
  (`next.config.ts` reads it during `next build` to exempt the mockup hosts
  from `X-Frame-Options: DENY` etc.; it is also read at runtime).

### 6. Database migration

Same way as in `MIGRATION.md` (tunnel or temporary public port):

```bash
DATABASE_URL="postgresql://…prod…" npm run db:migrate    # applies drizzle/0001_mockups.sql
```

### 7. Deploy and smoke-test

Redeploy the app in Coolify, then: Admin → Mockups → New project → upload a
folder with an `index.html` → Deploy → open the link (and check the embedded
preview renders — that needs `SITE_URL=https://doderasoft.com`, which is
already set).

---

## Day-to-day

- **New lead**: New project → name (the subdomain is derived, editable) → Deploy.
- **Iterate**: deploy again — the link updates instantly (files are served
  with `Cache-Control: no-cache` + ETag, so browsers revalidate).
- **Rollback**: Versions → *Make live* on an older version.
- **Rename the link**: Edit → Subdomain (the old link stops working).
- **Done with the lead**: Delete project — versions, files and the link go away.
- Entry file: `index.html` at the top level; otherwise the first top-level
  `.html`. A wrapper folder (`my-site/index.html`) is stripped automatically,
  as are `.DS_Store`, `__MACOSX`, `node_modules`, dotfiles.
- Mockups are served with `X-Robots-Tag: noindex`, never indexed.

## Telling InteliLang what went live

Each deployment can be sent to one InteliLang project (intelilang.com), so its chat
can answer "what's the staging link for Acme?" with the link and who deployed it.

1. In InteliLang, open the project → Sources → Add a source → "Another app (webhook)".
   Copy the address and the signing secret it shows (the secret is shown once).
2. Here: Admin → Settings → InteliLang. Paste both, Save, then "Send a test".
   The secret is encrypted with `APP_ENCRYPTION_KEY` before it is stored and is never
   shown again; only its last four characters are.
3. Deploying: "Send to InteliLang" under the Deploy button (ticked by default). A
   version sent there says so in the version list; one that wasn't (or failed) has a
   "Send to InteliLang" link. Making a sent version live again tells InteliLang too.

Messages are signed the Standard Webhooks way (`standardwebhooks`), see
`src/lib/intelilang.ts`. A deploy never fails because InteliLang is unreachable: the
version goes live and the message says it wasn't sent.

## Changing the domain

Prefer another name than `demo`? Change it in three places: the two DNS
records, the Traefik file (`rule` + `tls.domains`) and `MOCKUPS_DOMAIN`.
Names like `www`, `api`, `preview`, `vps`, `hooks` are reserved as slugs so
they can never collide with real hosts (`RESERVED_SLUGS` in `src/config/mockups.ts`).

## Local development

```bash
MOCKUPS_DOMAIN=demo.localhost:3000 npm run dev
# → http://<slug>.demo.localhost:3000/  (Chrome/Firefox resolve *.localhost)
# curl: curl -H "Host: <slug>.demo.localhost:3000" http://localhost:3000/
```
