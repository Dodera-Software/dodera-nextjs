import {
    Briefcase,
    FileText,
    ImageIcon,
    Key,
    LayoutDashboard,
    Mail,
    MailCheck,
    MessageSquare,
    MonitorSmartphone,
    Settings,
    Share2,
    SquareKanban,
    Users,
    type LucideIcon,
} from "lucide-react";

export enum AdminRoute {
    Dashboard = "/admin",
    Login = "/admin/login",
    Contacts = "/admin/contacts",
    Leads = "/admin/leads",
    Subscribers = "/admin/subscribers",
    Careers = "/admin/careers",
    Mockups = "/admin/mockups",
    Tokens = "/admin/tokens",
    GenerateImage = "/admin/generate-image",
    SocialPost = "/admin/generate-social-post",
    SendEmail = "/admin/send-email",
    WelcomeEmail = "/admin/welcome-email",
    ApiDocs = "/admin/api-docs",
    Settings = "/admin/settings",
}

export enum AdminNavGroup {
    Overview = "overview",
    People = "people",
    Studio = "studio",
    Content = "content",
    System = "system",
}

export interface AdminNavEntry {
    route: AdminRoute;
    group: AdminNavGroup;
    icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavEntry[] = [
    { route: AdminRoute.Dashboard, group: AdminNavGroup.Overview, icon: LayoutDashboard },
    { route: AdminRoute.Contacts, group: AdminNavGroup.People, icon: MessageSquare },
    { route: AdminRoute.Leads, group: AdminNavGroup.People, icon: SquareKanban },
    { route: AdminRoute.Subscribers, group: AdminNavGroup.People, icon: Users },
    { route: AdminRoute.Careers, group: AdminNavGroup.People, icon: Briefcase },
    { route: AdminRoute.Mockups, group: AdminNavGroup.Studio, icon: MonitorSmartphone },
    { route: AdminRoute.GenerateImage, group: AdminNavGroup.Content, icon: ImageIcon },
    { route: AdminRoute.SocialPost, group: AdminNavGroup.Content, icon: Share2 },
    { route: AdminRoute.SendEmail, group: AdminNavGroup.Content, icon: Mail },
    { route: AdminRoute.WelcomeEmail, group: AdminNavGroup.Content, icon: MailCheck },
    { route: AdminRoute.Tokens, group: AdminNavGroup.System, icon: Key },
    { route: AdminRoute.ApiDocs, group: AdminNavGroup.System, icon: FileText },
    { route: AdminRoute.Settings, group: AdminNavGroup.System, icon: Settings },
];

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
    AdminNavGroup.Overview,
    AdminNavGroup.People,
    AdminNavGroup.Studio,
    AdminNavGroup.Content,
    AdminNavGroup.System,
];

export function activeAdminRoute(pathname: string): AdminRoute {
    const match = ADMIN_NAV.filter(
        (entry) => entry.route === AdminRoute.Dashboard ? pathname === entry.route : pathname.startsWith(entry.route),
    ).sort((a, b) => b.route.length - a.route.length)[0];
    return match?.route ?? AdminRoute.Dashboard;
}

export const ADMIN_PAGE_SIZE = 25;

export const ADMIN_QUERY = {
    staleMs: 30_000,
    searchDebounceMs: 300,
} as const;


export enum AdminQueryKey {
    Session = "session",
    Contacts = "contacts",
    Subscribers = "subscribers",
    Tokens = "tokens",
    Careers = "careers",
    Applications = "applications",
    Leads = "leads",
    LeadSuggestions = "lead-suggestions",
    Mockups = "mockups",
    Config = "config",
    Smtp = "smtp",
    Intelilang = "intelilang",
    BlogPosts = "blog-posts",
    BlogPostExamples = "blog-post-examples",
    SocialPostExamples = "social-post-examples",
    WelcomeEmailTemplate = "welcome-email-template",
}

export const ADMIN_LINKS = {
    coolify: process.env.NEXT_PUBLIC_ADMIN_LINK_COOLIFY,
    prismicMigration: process.env.NEXT_PUBLIC_ADMIN_LINK_PRISMIC_MIGRATION,
    prismicMigrationFallback: "https://dodera-nextjs.prismic.io/builder/migration",
} as const;
