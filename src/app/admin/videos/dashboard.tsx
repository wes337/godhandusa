"use client";

import { Video } from "@/lib/videos";
import AdminHeader from "../admin-header";
import VideoForm from "./video-form";
import "../admin.css";

export default function Dashboard({ videos }: { videos: Video[] }) {
  return (
    <div className="admin">
      <AdminHeader />
      <div className="admin-panel">
        <div className="admin-section">New Video</div>
        <VideoForm />
      </div>
      <div className="admin-panel">
        <div className="admin-section">Videos ({videos.length})</div>
        {videos.length === 0 && <div className="admin-empty">No videos</div>}
        {videos.map((video) => (
          <VideoForm key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
