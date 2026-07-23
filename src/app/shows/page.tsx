import { getShows } from "@/lib/shows";
import ShowsList from "./shows-list";

export const revalidate = 300;

export default async function Shows() {
  const shows = await getShows();

  return <ShowsList shows={shows} />;
}
