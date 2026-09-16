const HOUR_MS = 3_600_000;
export const hoursAgo = (hours: number) => new Date(Date.now() - hours * HOUR_MS);

export type SeedCompanies = { kavurma: { id: string }; nova: { id: string } };
export type SeedPeople = Record<"deniz" | "can" | "elif" | "ayse" | "emre" | "burak", { id: string }>;
