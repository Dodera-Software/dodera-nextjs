import { Globe, KeyRound, Lock, Webhook, type LucideIcon } from "lucide-react";
import { StatusTone } from "@/config/ui";

export enum HttpMethod {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Patch = "PATCH",
    Delete = "DELETE",
}

export enum ApiAuth {
    ApiToken = "api-token",
    AdminSession = "admin-session",
    WebhookSecret = "webhook-secret",
    None = "none",
}

export const API_AUTH_ORDER: ApiAuth[] = [ApiAuth.ApiToken, ApiAuth.AdminSession, ApiAuth.WebhookSecret, ApiAuth.None];

export const HTTP_METHOD_TONE: Record<HttpMethod, StatusTone> = {
    [HttpMethod.Get]: StatusTone.Success,
    [HttpMethod.Post]: StatusTone.Info,
    [HttpMethod.Put]: StatusTone.Warning,
    [HttpMethod.Patch]: StatusTone.Brand,
    [HttpMethod.Delete]: StatusTone.Danger,
};

export const API_AUTH_STYLE: Record<ApiAuth, { tone: StatusTone; icon: LucideIcon }> = {
    [ApiAuth.ApiToken]: { tone: StatusTone.Warning, icon: KeyRound },
    [ApiAuth.AdminSession]: { tone: StatusTone.Info, icon: Lock },
    [ApiAuth.WebhookSecret]: { tone: StatusTone.Brand, icon: Webhook },
    [ApiAuth.None]: { tone: StatusTone.Success, icon: Globe },
};
