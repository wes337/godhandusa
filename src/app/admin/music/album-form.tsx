"use client";

import { useRef, useEffect, useActionState } from "react";
import { saveAlbum, AlbumFormState } from "../actions";

const INITIAL_STATE: AlbumFormState = {
  errors: {},
  success: false,
};

export default function AlbumForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(saveAlbum, INITIAL_STATE);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  const errors = Object.values(state.errors).flat();

  return (
    <form ref={formRef} className="admin-show" action={action}>
      <div className="admin-fields">
        <label className="admin-field-full">
          Spotify Album ID/URL
          <input
            name="id"
            type="text"
            placeholder="https://open.spotify.com/album/..."
            required
          />
        </label>
      </div>
      {errors.length > 0 && (
        <div className="admin-error">{errors.join(" / ")}</div>
      )}
      <div className="admin-buttons">
        <button type="submit" disabled={pending}>
          Add Album
        </button>
      </div>
    </form>
  );
}
