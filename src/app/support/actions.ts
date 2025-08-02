"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import Zendesk from "@/lib/zendesk";

const SupportTicketSchema = z.object({
  email: z.string().trim().email(),
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" }),
  order: z.string().trim().optional(),
  body: z
    .string()
    .trim()
    .min(8, { message: "Message must be at least 8 characters long" }),
  issue: z.enum([
    "where_is_my_order",
    "redelivery_or_lost_package",
    "missing/wrong_item_in_package",
    "cancel/edit_order_information",
    "damaged/defective_product",
  ]),
});

export type SupportTicketState = {
  email?: string;
  name?: string;
  order?: string;
  body?: string;
  issue?: string;
  errors?: {
    email?: string[];
    name?: string[];
    order?: string[];
    body?: string[];
    issue?: string[];
  };
};

export async function createSupportTicket(
  _previousState: SupportTicketState,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const order = formData.get("order") as string;
  const body = formData.get("body") as string;
  const issue = formData.get("issue") as string;

  const validatedFields = SupportTicketSchema.safeParse({
    email,
    name,
    order,
    body,
    issue,
  });

  if (!validatedFields.success) {
    return {
      email,
      name,
      order,
      body,
      issue,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const uploads = [];
  const requester = { name, email };

  await Zendesk.createTicket(requester, issue, body, order, uploads);

  redirect("/support/success");
}
