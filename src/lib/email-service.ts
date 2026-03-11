import "server-only";
import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";
import { buildUnsubscribeUrl } from "@/lib/unsubscribe-token";

export const SENDER_EMAIL = "news@doderasoft.com";
export const SENDER_NAME = "Dodera News";

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true, // SSL
    auth: {
        user: SENDER_EMAIL,
        pass: process.env.ZOHO_SMTP_PASSWORD,
    },
    tls: {
        // Respect NODE_TLS_REJECT_UNAUTHORIZED=0 for local Windows dev
        // (bypasses SSL cert chain issues). Always true in production.
        rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0",
    },
});

export interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    attachments?: Attachment[];
}

export interface SendResult {
    success: boolean;
    accepted: string[];
    rejected: string[];
    error?: string;
}

/**
 * Send an email via Zoho SMTP.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendResult> {
    try {
        const info = await transporter.sendMail({
            from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
            to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
            subject: options.subject,
            html: options.html,
            attachments: options.attachments,
        });

        return {
            success: true,
            accepted: info.accepted as string[],
            rejected: info.rejected as string[],
        };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[email-service] Failed to send email:", message);
        return { success: false, accepted: [], rejected: [], error: message };
    }
}

/**
 * Verify SMTP connection.
 */
export async function verifySmtp(): Promise<{ ok: boolean; error?: string }> {
    try {
        await transporter.verify();
        return { ok: true };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return { ok: false, error: message };
    }
}

/* ── Unsubscribe footer ──────────────────────────────────────── */

/**
 * Build a minimal HTML unsubscribe footer block to append to any subscriber
 * email.  The block uses inline styles so it renders correctly in all email
 * clients.
 *
 * @param subscriberEmail - The recipient's email address (used to generate the
 *   HMAC-signed unsubscribe URL).
 */
export function buildUnsubscribeFooter(subscriberEmail: string): string {
    const unsubscribeUrl = buildUnsubscribeUrl(subscriberEmail);

    const unsubscribeLine = unsubscribeUrl
        ? `<p style="margin:0;">Don't want to receive these emails?&nbsp;<a href="${unsubscribeUrl}" style="color:#6b7280;text-decoration:underline;white-space:nowrap;">Unsubscribe</a></p>`
        : ``;

    return `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
       style="margin-top:32px;border-top:1px solid #e5e7eb;">
  <tr>
    <td align="center"
        style="padding:20px 16px 24px;font-family:ui-sans-serif,system-ui,Arial,sans-serif;
               font-size:12px;line-height:1.5;color:#9ca3af;">
      <p style="margin:0 0 6px;">
        You're receiving this email because you subscribed to the
        <strong style="color:#6b7280;">Dodera Software</strong> newsletter.
      </p>
      ${unsubscribeLine}
    </td>
  </tr>
</table>`.trim();
}

/**
 * Inject the unsubscribe footer into a **complete** HTML email document
 * (e.g., one exported by Unlayer / react-email-editor) by inserting it
 * directly before the closing `</body>` tag.
 *
 * Use this when `html` is already a full document.  For a raw body fragment
 * use `buildSubscriberEmail` instead.
 */
export function injectUnsubscribeFooter(html: string, subscriberEmail: string): string {
    const footer = buildUnsubscribeFooter(subscriberEmail);
    const closeBodyIdx = html.lastIndexOf("</body>");
    if (closeBodyIdx === -1) return html + footer; // fallback
    return html.slice(0, closeBodyIdx) + footer + "\n</body>" + html.slice(closeBodyIdx + 7);
}

/**
 * Wrap arbitrary email `bodyHtml` in a simple full-page wrapper and append
 * the unsubscribe footer.  Use this for any email sent to newsletter
 * subscribers.
 *
 * @param bodyHtml        - The main body HTML (will be placed inside a centred
 *   container).
 * @param subscriberEmail - The recipient's address — used to generate their
 *   personal unsubscribe link.
 */
export function buildSubscriberEmail(bodyHtml: string, subscriberEmail: string): string {
    const footer = buildUnsubscribeFooter(subscriberEmail);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation"
               style="max-width:600px;width:100%;background:#ffffff;
                      border-radius:8px;border:1px solid #e5e7eb;
                      padding:32px 40px;">
          <tr>
            <td>
              ${bodyHtml}
              ${footer}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
