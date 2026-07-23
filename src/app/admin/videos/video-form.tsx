"use client";

import { useRef, useEffect, useActionState } from "react";
import { Video } from "@/lib/videos";
import { saveVideo, removeVideo, VideoFormState } from "../actions";

const INITIAL_STATE: VideoFormState = {
  errors: {},
  success: false,
};

export default function VideoForm({ video }: { video?: Video }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(saveVideo, INITIAL_STATE);
  const isNew = !video;

  useEffect(() => {
    if (isNew && state.success) {
      formRef.current?.reset();
    }
  }, [isNew, state]);

  const errors = Object.values(state.errors).flat();

  return (
    <form ref={formRef} className="admin-show" action={action}>
      <input type="hidden" name="originalId" value={video?.id || ""} />
      <div className="admin-fields">
        <label className="admin-field-full">
          Name
          <input
            name="name"
            type="text"
            placeholder="DI$ SIDE"
            defaultValue={video?.name}
            required
          />
        </label>
        <label className="admin-field-full">
          Youtube ID/URL
          <input
            name="url"
            type="text"
            placeholder="P5EKMn7OQik"
            defaultValue={video?.url}
            required
          />
        </label>
      </div>
      {errors.length > 0 && (
        <div className="admin-error">{errors.join(" / ")}</div>
      )}
      <div className="admin-buttons">
        <button type="submit" disabled={pending}>
          {isNew ? "Add Video" : "Save"}
        </button>
        {!isNew && (
          <button
            type="submit"
            className="admin-delete"
            formAction={removeVideo}
            onClick={(event) => {
              if (!confirm(`Delete video: ${video.name}?`)) {
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
