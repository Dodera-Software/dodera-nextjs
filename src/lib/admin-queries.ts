import { queryOptions } from "@tanstack/react-query";
import { AdminQueryKey } from "@/config/admin";
import { adminFetch, type Paginated } from "@/lib/admin-api";
import type { AdminBlogPost, AdminSession, ApiToken, ConfigRow, Lead } from "@/types/admin";

export const sessionQuery = queryOptions({
    queryKey: [AdminQueryKey.Session],
    queryFn: () => adminFetch<{ user: AdminSession }>("/api/admin/session").then((r) => r.user),
    retry: false,
    staleTime: Infinity,
});

export const leadsQuery = queryOptions({
    queryKey: [AdminQueryKey.Leads],
    queryFn: () => adminFetch<{ data: Lead[] }>("/api/admin/leads").then((r) => r.data),
});

const TOKENS_LIMIT = 200;

export const tokensQuery = queryOptions({
    queryKey: [AdminQueryKey.Tokens],
    queryFn: () => adminFetch<{ data: ApiToken[] }>("/api/admin/tokens", { query: { limit: TOKENS_LIMIT } }).then((r) => r.data),
});

export function totalQuery(key: AdminQueryKey, path: string) {
    return queryOptions({
        queryKey: [key, "total"],
        queryFn: () => adminFetch<Paginated<unknown>>(path, { query: { page: 1, limit: 1 } }).then((r) => r.pagination.total),
    });
}

export const configQuery = queryOptions({
    queryKey: [AdminQueryKey.Config],
    queryFn: () => adminFetch<{ data: ConfigRow[] }>("/api/admin/config").then((r) => r.data),
});

export const blogPostsQuery = queryOptions({
    queryKey: [AdminQueryKey.BlogPosts],
    queryFn: () => adminFetch<{ posts: AdminBlogPost[] }>("/api/admin/blog-posts").then((r) => r.posts),
});
