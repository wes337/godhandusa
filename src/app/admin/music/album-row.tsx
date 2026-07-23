"use client";

import { useState } from "react";
import Image from "next/image";
import { Album } from "@/lib/albums";
import { refreshAlbum, removeAlbum } from "../actions";
import TrackModal from "./track-modal";

export default function AlbumRow({ album }: { album: Album }) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <form className="admin-show" action={refreshAlbum}>
        <input type="hidden" name="id" value={album.id} />
        <div className="admin-album">
          {album.cover ? (
            <Image
              className="admin-album-cover"
              src={album.cover}
              alt=""
              width={64}
              height={64}
            />
          ) : (
            <div className="admin-album-cover admin-album-cover-empty" />
          )}
          <div className="admin-album-info">
            <div className="admin-album-title">{album.title}</div>
            <div className="admin-album-meta">
              {new Date(album.releaseDate).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              {` // ${album.tracks.length} tracks`}
            </div>
          </div>
        </div>
        <div className="admin-buttons">
          <button type="button" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button
            type="submit"
            className="admin-archive"
            onClick={(event) => {
              if (
                !confirm(
                  `Refresh "${album.title}"? This will pull the album data from Spotify and replace what is currently saved, including any manual track edits.`
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            Refresh
          </button>
          <button
            type="submit"
            className="admin-delete"
            formAction={removeAlbum}
            onClick={(event) => {
              if (!confirm(`Delete album: ${album.title}?`)) {
                event.preventDefault();
              }
            }}
          >
            Delete
          </button>
        </div>
      </form>
      {editing && (
        <TrackModal album={album} onClose={() => setEditing(false)} />
      )}
    </>
  );
}
