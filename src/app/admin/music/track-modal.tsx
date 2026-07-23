"use client";

import { useEffect, useActionState } from "react";
import { Album } from "@/lib/albums";
import { saveAlbumTracks, AlbumFormState } from "../actions";

const INITIAL_STATE: AlbumFormState = {
  errors: {},
  success: false,
};

export default function TrackModal({
  album,
  onClose,
}: {
  album: Album;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState(
    saveAlbumTracks,
    INITIAL_STATE
  );

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state, onClose]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const errors = Object.values(state.errors).flat();

  return (
    <>
      <div className="admin-modal-backdrop" onClick={onClose} />
      <form className="admin-modal" action={action}>
        <input type="hidden" name="albumId" value={album.id} />
        <div className="admin-section">{`${album.title} // Tracks`}</div>
        <div className="admin-tracks">
          {album.tracks.map((track) => (
            <div key={track.id} className="admin-track">
              <div className="admin-fields">
                <label>
                  Track #
                  <input
                    name="trackNo"
                    type="number"
                    min={1}
                    defaultValue={track.trackNo}
                    required
                  />
                </label>
                <label>
                  Duration (MS)
                  <input
                    name="trackDurationMS"
                    type="number"
                    min={0}
                    defaultValue={track.durationMS}
                    required
                  />
                </label>
                <label className="admin-field-full">
                  Title
                  <input
                    name="trackTitle"
                    type="text"
                    defaultValue={track.title}
                    required
                  />
                </label>
                <label className="admin-field-full">
                  Spotify Track ID
                  <input
                    name="trackId"
                    type="text"
                    defaultValue={track.id}
                    required
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
        {errors.length > 0 && (
          <div className="admin-error">{errors.join(" / ")}</div>
        )}
        <div className="admin-buttons">
          <button type="submit" disabled={pending}>
            Save Tracks
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
