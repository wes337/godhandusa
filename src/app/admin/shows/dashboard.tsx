"use client";

import { useState } from "react";
import { Show } from "@/lib/shows";
import AdminHeader from "../admin-header";
import ShowForm from "./show-form";
import "../admin.css";

export default function Dashboard({ shows }: { shows: Show[] }) {
  const [tab, setTab] = useState<"active" | "archived">("active");

  const activeShows = shows.filter((show) => !show.archived);
  const archivedShows = shows.filter((show) => show.archived);
  const visibleShows = tab === "active" ? activeShows : archivedShows;

  return (
    <div className="admin">
      <AdminHeader />
      <div className="admin-panel">
        <div className="admin-section">New Show</div>
        <ShowForm />
      </div>
      <div className="admin-panel">
        <div className="admin-tabs">
          <button
            type="button"
            className={tab === "active" ? "active" : ""}
            onClick={() => setTab("active")}
          >
            Shows ({activeShows.length})
          </button>
          <button
            type="button"
            className={tab === "archived" ? "active" : ""}
            onClick={() => setTab("archived")}
          >
            Archived ({archivedShows.length})
          </button>
        </div>
        {visibleShows.length === 0 && (
          <div className="admin-empty">
            {tab === "active" ? "No shows" : "No archived shows"}
          </div>
        )}
        {visibleShows.map((show) => (
          <ShowForm key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
}
