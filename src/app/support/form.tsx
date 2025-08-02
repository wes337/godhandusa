"use client";

import { useState, useActionState, useEffect, FormEvent } from "react";
import { redirect } from "next/navigation";
import { IconPaperclip, IconPhoto, IconFile, IconX } from "@tabler/icons-react";
import { MAX_ATTACHMENTS, MAX_ATTACHMENTS_FILE_SIZE } from "@/utils";
import { createSupportTicket } from "./actions";
import "./support.css";

const ISSUES = [
  {
    label: "",
    tag: undefined,
  },
  {
    label: "Where Is My Order?",
    tag: "where_is_my_order",
  },
  {
    label: "Redelivery or Lost Package",
    tag: "redelivery_or_lost_package",
  },
  {
    label: "Missing/Wrong Item In Package",
    tag: "missing/wrong_item_in_package",
  },
  {
    label: "Cancel/Edit Order Information",
    tag: "cancel/edit_order_information",
  },
  {
    label: "Damaged/Defective Product",
    tag: "damaged/defective_product",
  },
];

export default function Support() {
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [state, action, pending] = useActionState(createSupportTicket, {
    email: "",
    name: "",
    order: "",
    body: "",
    issue: "",
    errors: {},
    success: false,
  });

  useEffect(() => {
    if (state.success === true) {
      redirect("/support/success");
    }
  }, [state]);

  const handleFileChange = (event: FormEvent) => {
    const selectedFiles: File[] = Array.from(
      (event.target as HTMLInputElement).files || []
    );
    setFileError("");

    if (selectedFiles.length > MAX_ATTACHMENTS) {
      setFileError(`Maximum ${MAX_ATTACHMENTS} files allowed`);
      return;
    }

    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > MAX_ATTACHMENTS_FILE_SIZE
    );

    if (oversizedFiles.length > 0) {
      setFileError(
        `Files must be smaller than 20MB: ${oversizedFiles
          .map(({ name }) => name)
          .join(", ")}`
      );
      return;
    }

    setFiles(selectedFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    const input = document.getElementById("attachments") as HTMLInputElement;
    if (input) {
      const dt = new DataTransfer();
      newFiles.forEach((file) => dt.items.add(file));
      input.files = dt.files;
    }
  };

  return (
    <form className="supportForm" action={action}>
      <div>
        <label htmlFor="email">Email Address</label>
        <div className="subLabel">Email connected to the purchase. </div>
        <input type="email" name="email" required />
        {state.errors?.email && (
          <div className="error">{state.errors.email}</div>
        )}
      </div>
      <div>
        <label htmlFor="name">Full Name</label>
        <div className="subLabel">Full name connected to the purchase.</div>
        <input type="text" name="name" required />
        {state.errors?.name && <div className="error">{state.errors.name}</div>}
      </div>
      <div>
        <label htmlFor="order">Order number</label>
        <div className="subLabel">
          Your 4-5 digit order number. Appears in your confirmation email upon
          purchase - eg. #12345. Input number only (No &apos;#&apos; at the
          beginning). This is not your USPS tracking number or
          Invoice/Transaction ID.
        </div>
        <input type="text" name="order" />
        {state.errors?.order && (
          <div className="error">{state.errors.order}</div>
        )}
      </div>
      <div>
        <label htmlFor="issue">Issue Type</label>
        <select name="issue" required>
          {ISSUES.map(({ label, tag }, index) => (
            <option key={index} value={tag}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="body">How can we help you?</label>
        <textarea name="body" rows={5} required />
        {state.errors?.body && <div className="error">{state.errors.body}</div>}
      </div>
      <div>
        <label htmlFor="attachments">Attachments</label>
        <div className="attachments">
          {files.length > 0 ? (
            <div className="files">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  className="file"
                >
                  {file.type.match(/image/gi) ? (
                    <IconPhoto size={18} />
                  ) : (
                    <IconFile size={18} />
                  )}
                  <div className="fileName">{file.name}</div>
                  <button
                    type="button"
                    className="remove"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <IconX size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <span>
              <IconPaperclip size={14} /> Add up to {MAX_ATTACHMENTS} files
            </span>
          )}
          <input
            type="file"
            id="attachments"
            name="attachments"
            accept="image/*,.pdf,.doc,.docx,.txt"
            multiple
            onChange={handleFileChange}
            disabled={files.length >= MAX_ATTACHMENTS}
          />
          {(fileError || state.errors.attachments) && (
            <div className="error">{fileError || state.errors.attachments}</div>
          )}
        </div>
      </div>
      <button type="submit" disabled={pending}>
        Send
      </button>
    </form>
  );
}
