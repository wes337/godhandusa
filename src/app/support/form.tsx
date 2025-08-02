"use client";

import { useActionState } from "react";
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
  const [state, action, pending] = useActionState(createSupportTicket, {
    email: "",
    name: "",
    order: "",
    body: "",
    issue: "",
    errors: {},
  });

  return (
    <form className="supportForm" action={action}>
      <div>
        <label htmlFor="email">Email Address</label>
        <div className="subLabel">Email connected to the purchase. </div>
        <input type="email" name="email" required />
        {state.errors.email && (
          <div className="error">{state.errors.email}</div>
        )}
      </div>
      <div>
        <label htmlFor="name">Full Name</label>
        <div className="subLabel">Full name connected to the purchase.</div>
        <input type="text" name="name" required />
        {state.errors.name && <div className="error">{state.errors.name}</div>}
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
        {state.errors.order && (
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
        {state.errors.body && <div className="error">{state.errors.body}</div>}
      </div>
      <button type="submit" disabled={pending}>
        Send
      </button>
    </form>
  );
}
