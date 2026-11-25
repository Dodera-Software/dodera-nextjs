import { adminCommon } from "@/i18n/admin/common";

export const contactsCopy = {
    eyebrow: "Inbox",
    title: "Contacts",
    description: (total: number) => `${adminCommon.plural(total, "message", "messages")} from the contact form.`,
    search: "Search by name, email or company…",
    columns: { name: "Name", email: "Email", company: "Company", phone: "Phone", date: "Date" },
    detail: { message: "Message", company: "Company", phone: "Phone" },
    empty: { title: "No messages yet", description: "Messages sent through the contact form show up here." },
    remove: {
        title: "Delete contact",
        description: (name: string) => `Delete the message from ${name}? This cannot be undone.`,
        done: "Contact deleted",
    },
    exportCsv: {
        header: ["ID", "Name", "Email", "Company", "Phone", "Message", "Date"],
        filename: (date: string) => `contacts-${date}.csv`,
        done: (count: number) => `Exported ${adminCommon.plural(count, "contact", "contacts")}`,
    },
} as const;
