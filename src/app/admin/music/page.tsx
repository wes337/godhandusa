import { isAdmin } from "@/lib/admin";
import { getAlbums } from "@/lib/albums";
import LoginForm from "../login-form";
import Dashboard from "./dashboard";

export default async function AdminMusic() {
  const authorized = await isAdmin();

  if (!authorized) {
    return <LoginForm />;
  }

  const albums = await getAlbums();

  return <Dashboard albums={albums} />;
}
