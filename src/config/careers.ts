export enum JobStatus {
    Open = "open",
    Closed = "closed",
    Draft = "draft",
}

export enum JobType {
    FullTime = "Full-time",
    PartTime = "Part-time",
    Contract = "Contract",
    Internship = "Internship",
}

export const JOB_STATUSES: JobStatus[] = [JobStatus.Open, JobStatus.Closed, JobStatus.Draft];

export const JOB_TYPES: JobType[] = [JobType.FullTime, JobType.PartTime, JobType.Contract, JobType.Internship];

export const JOB_DEFAULT_LOCATION = "Remote";
