import { revalidatePath } from "next/cache";

// projects show up in lists, dashboards and detail pages of both panels, so refresh both entirely
export function revalidateProjects() {
  revalidatePath("/panel", "layout");
  revalidatePath("/yonetim", "layout");
}
