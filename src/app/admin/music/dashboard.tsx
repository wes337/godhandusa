"use client";

import { Album } from "@/lib/albums";
import AdminHeader from "../admin-header";
import AlbumForm from "./album-form";
import AlbumRow from "./album-row";
import "../admin.css";

export default function Dashboard({ albums }: { albums: Album[] }) {
  return (
    <div className="admin">
      <AdminHeader />
      <div className="admin-panel">
        <div className="admin-section">New Album</div>
        <AlbumForm />
      </div>
      <div className="admin-panel">
        <div className="admin-section">Albums ({albums.length})</div>
        {albums.length === 0 && <div className="admin-empty">No albums</div>}
        {albums.map((album) => (
          <AlbumRow key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}
