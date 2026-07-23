"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./actions";
import "./admin.css";

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-header-row">
          <div className="admin-title">[GODHANDUSA ADMIN]</div>
          <form className="admin-logout" action={logout}>
            <button type="submit">Logout</button>
          </form>
        </div>
        <div className="admin-header-row">
          <div className="admin-nav">
            <Link
              href="/admin/shows"
              className={pathname === "/admin/shows" ? "active" : ""}
            >
              Shows
            </Link>
            <Link
              href="/admin/videos"
              className={pathname === "/admin/videos" ? "active" : ""}
            >
              Videos
            </Link>
            <Link
              href="/admin/music"
              className={pathname === "/admin/music" ? "active" : ""}
            >
              Music
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
