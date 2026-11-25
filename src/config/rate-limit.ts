export enum RateLimitScope {
    Contact = "contact",
    Newsletter = "newsletter",
    Apply = "apply",
    AdminLogin = "admin_login",
    AdminLoginAccount = "admin_login_account",
}

export const RATE_LIMIT_DEFAULTS: Record<RateLimitScope, { max: number; windowMinutes: number }> = {
    [RateLimitScope.Contact]: { max: 5, windowMinutes: 60 },
    [RateLimitScope.Newsletter]: { max: 5, windowMinutes: 60 },
    [RateLimitScope.Apply]: { max: 5, windowMinutes: 60 },
    [RateLimitScope.AdminLogin]: { max: 5, windowMinutes: 60 },
    [RateLimitScope.AdminLoginAccount]: { max: 10, windowMinutes: 60 },
};

export const FAIL_CLOSED_SCOPES: ReadonlySet<RateLimitScope> = new Set([
    RateLimitScope.AdminLogin,
    RateLimitScope.AdminLoginAccount,
]);
