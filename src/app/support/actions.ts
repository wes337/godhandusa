"use server";

import { z } from "zod";
import { MAX_ATTACHMENTS, MAX_ATTACHMENTS_FILE_SIZE } from "@/utils";
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
  email: string;
  name: string;
  order: string;
  body: string;
  issue: string;
  errors: {
    email?: string[];
    name?: string[];
    order?: string[];
    body?: string[];
    issue?: string[];
    attachments?: string[];
  };
  success: boolean;
};

export async function createSupportTicket(
  _previousState: unknown,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const order = formData.get("order") as string;
  const body = formData.get("body") as string;
  const issue = formData.get("issue") as string;
  const attachments = formData
    .getAll("attachments")
    .filter((file) => file instanceof File && file.size > 0) as File[];

  const validatedFields = SupportTicketSchema.safeParse({
    email,
    name,
    order,
    body,
    issue,
  });

  const fileErrors: { attachments?: string } = {};
  if (attachments && attachments.length > MAX_ATTACHMENTS) {
    fileErrors.attachments = `Maximum ${MAX_ATTACHMENTS} files allowed`;
  }

  const oversizedFiles = attachments
    ? attachments.filter(({ size }) => size > MAX_ATTACHMENTS_FILE_SIZE)
    : [];

  if (oversizedFiles.length > 0) {
    fileErrors.attachments = "Attachments must be smaller than 20MB.";
  }

  if (!validatedFields.success) {
    return {
      email,
      name,
      order,
      body,
      issue,
      errors: { ...validatedFields.error.flatten().fieldErrors, ...fileErrors },
      success: false,
    };
  }

  const uploads: string[] = [];

  if (attachments && attachments.length > 0) {
    for (const file of attachments) {
      try {
        const token = await Zendesk.uploadFile(file);
        uploads.push(token);
      } catch {
        return {
          email,
          name,
          order,
          body,
          issue,
          errors: {
            attachments: `Failed to upload file: ${file.name}. Please try again.`,
          },
          success: false,
        };
      }
    }
  }

  const requester = { name, email };
  await Zendesk.createTicket(requester, issue, body, order, uploads);

  return {
    email,
    name,
    order,
    body,
    issue,
    errors: {},
    success: true,
  };
}
