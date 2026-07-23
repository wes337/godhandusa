import { getAlbums } from "@/lib/albums";
import MusicList from "./music-list";

export const revalidate = 300;

export default async function Music() {
  const albums = await getAlbums();

  return <MusicList albums={albums} />;
}
