import "server-only";
import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";

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
        rejectUnauthorized: true,
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
