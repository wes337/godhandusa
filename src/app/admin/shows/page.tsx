import { isAdmin } from "@/lib/admin";
import { getAllShows } from "@/lib/shows";
import LoginForm from "../login-form";
import Dashboard from "./dashboard";

export default async function AdminShows() {
  const authorized = await isAdmin();

  if (!authorized) {
    return <LoginForm />;
  }

  const shows = await getAllShows();

  return <Dashboard shows={shows} />;
}
