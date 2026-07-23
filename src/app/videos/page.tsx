import { getVideos } from "@/lib/videos";
import VideosList from "./videos-list";

export const revalidate = 300;

export default async function Videos() {
  const videos = await getVideos();

  return <VideosList videos={videos} />;
}
