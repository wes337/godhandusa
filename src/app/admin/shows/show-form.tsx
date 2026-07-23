"use client";

import { useRef, useEffect, useActionState } from "react";
import { Show } from "@/lib/shows";
import { saveShow, removeShow, archiveShow, ShowFormState } from "../actions";

const INITIAL_STATE: ShowFormState = {
  errors: {},
  success: false,
};

function toDateInputValue(date: string) {
  const time = Date.parse(date);

  if (Number.isNaN(time)) {
    return "";
  }

  const parsed = new Date(time);
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function ShowForm({ show }: { show?: Show }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(saveShow, INITIAL_STATE);
  const isNew = !show;

  useEffect(() => {
    if (isNew && state.success) {
      formRef.current?.reset();
    }
  }, [isNew, state]);

  const errors = Object.values(state.errors).flat();

  return (
    <form ref={formRef} className="admin-show" action={action}>
      <input type="hidden" name="id" value={show?.id || ""} />
      <input
        type="hidden"
        name="archived"
        value={show?.archived ? "false" : "true"}
      />
      <div className="admin-fields">
        <label>
          Date
          <input
            name="date"
            type="date"
            defaultValue={show ? toDateInputValue(show.date) : ""}
            required
          />
        </label>
        <label>
          City
          <input
            name="city"
            type="text"
            placeholder="Van Nuys, CA"
            defaultValue={show?.city}
            required
          />
        </label>
        <label>
          Venue
          <input
            name="venue"
            type="text"
            placeholder="HazHeart Store"
            defaultValue={show?.venue}
            required
          />
        </label>
        <label>
          Ticket link
          <input
            name="ticketLink"
            type="text"
            placeholder="https://..."
            defaultValue={show?.ticketLink}
          />
        </label>
        <label className="admin-checkbox">
          <input
            name="soldOut"
            type="checkbox"
            defaultChecked={show?.soldOut}
          />
          Sold out
        </label>
      </div>
      {errors.length > 0 && (
        <div className="admin-error">{errors.join(" / ")}</div>
      )}
      <div className="admin-buttons">
        <button type="submit" disabled={pending}>
          {isNew ? "Add Show" : "Save"}
        </button>
        {!isNew && (
          <button
            type="submit"
            className="admin-archive"
            formAction={archiveShow}
          >
            {show.archived ? "Restore" : "Archive"}
          </button>
        )}
        {!isNew && (
          <button
            type="submit"
            className="admin-delete"
            formAction={removeShow}
            onClick={(event) => {
              if (!confirm(`Delete show: ${show.city} - ${show.venue}?`)) {
                event.preventDefault();
              }
            }}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
