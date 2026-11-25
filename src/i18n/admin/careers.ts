import { JobStatus } from "@/config/careers";
import { adminCommon } from "@/i18n/admin/common";

export const careersCopy = {
    eyebrow: "Hiring",
    title: "Careers",
    description: (open: number, applications: number) =>
        `${adminCommon.plural(open, "open position", "open positions")} · ${adminCommon.plural(applications, "application", "applications")}`,
    add: "Add position",
    tabs: { openings: "Positions", applications: "Applications" },
    status: {
        [JobStatus.Open]: "Open",
        [JobStatus.Closed]: "Closed",
        [JobStatus.Draft]: "Draft",
    } satisfies Record<JobStatus, string>,
    changeStatus: "Change status",
    statusChanged: (status: string) => `Marked as ${status.toLowerCase()}`,
    columns: { title: "Title", type: "Type", location: "Location", status: "Status", created: "Created" },
    empty: { title: "No positions yet", description: "Add a position to list it on the careers page." },
    form: {
        createTitle: "New position",
        editTitle: "Edit position",
        description: "Open positions are listed on the public careers page.",
        title: "Title",
        titlePlaceholder: "e.g. Senior Full-Stack Engineer",
        titleRequired: "Title is required.",
        department: "Department",
        departmentPlaceholder: "e.g. Engineering",
        location: "Location",
        locationPlaceholder: "e.g. Remote",
        type: "Type",
        status: "Status",
        applyUrl: "Apply URL",
        applyUrlPlaceholder: "https://…",
        applyUrlInvalid: "Enter a full URL, or leave it empty.",
        sortOrder: "Sort order",
        sortOrderInvalid: "Use a whole number.",
        body: "Description",
        bodyPlaceholder: "Role overview, responsibilities, requirements…",
    },
    created: "Position created",
    updated: "Position updated",
    remove: {
        title: "Delete position",
        description: (title: string) => `Delete "${title}"? This cannot be undone.`,
        done: "Position deleted",
    },
    applications: {
        columns: { name: "Name", email: "Email", position: "Position", received: "Received" },
        cv: "Download CV",
        empty: { title: "No applications yet", description: "Applications sent from the careers page show up here." },
    },
} as const;
