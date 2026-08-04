import { getShows } from "@/lib/shows";
import ShowsList from "./shows/shows-list";
import SplashImage from "@/components/splash-image";
import "./home.css";

export const revalidate = 300;

export const metadata = {
  title: "GODHANDUSA",
};

export default async function Home() {
  const shows = await getShows();

  return (
    <>
      <SplashImage src="/guys.png" className="background" />
      <ShowsList shows={shows} home />
    </>
  );
}
