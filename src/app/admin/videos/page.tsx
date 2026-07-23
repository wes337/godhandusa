import { isAdmin } from "@/lib/admin";
import { getVideos } from "@/lib/videos";
import LoginForm from "../login-form";
import Dashboard from "./dashboard";

export default async function AdminVideos() {
  const authorized = await isAdmin();

  if (!authorized) {
    return <LoginForm />;
  }

  const videos = await getVideos();

  return <Dashboard videos={videos} />;
}
