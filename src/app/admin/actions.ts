"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  checkPassword,
  createAdminSession,
  destroyAdminSession,
  isAdminAuthenticated,
} from "@/lib/auth";
import { insertProduct } from "@/lib/db";

export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") || "");
  if (!checkPassword(password)) {
    redirect("/admin?error=wrong-password");
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin");
}

export async function createProductAction(formData: FormData): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=not-authenticated");
  }

  const field = (key: string) => String(formData.get(key) || "").trim();
  const name = field("name");
  const type = field("type");
  const category = field("category");

  if (!name || !type || !category) {
    redirect("/admin?error=missing-fields");
  }

  const id = insertProduct({
    name,
    brand: field("brand"),
    type,
    category,
    use_cases: field("use_cases"),
    sheen: field("sheen"),
    application_method: field("application_method"),
    coats_recommended: field("coats_recommended"),
    coverage: field("coverage"),
    dry_time_touch: field("dry_time_touch"),
    dry_time_recoat: field("dry_time_recoat"),
    dry_time_cure: field("dry_time_cure"),
    voc_content: field("voc_content"),
    thinner_cleanup: field("thinner_cleanup"),
    surface_prep: field("surface_prep"),
    description: field("description"),
    sku: field("sku"),
    source_url: field("source_url"),
  });

  revalidatePath("/");
  redirect(`/products/${id}?added=1`);
}
