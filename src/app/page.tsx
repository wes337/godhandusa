import ImageGlitch from "./image-glitch";
import NavLink from "./link";
import Footer from "./footer";

export const metadata = {
  title: "GODHANDUSA",
};

export default function Home() {
  return (
    <div className="fillAvailable w-[100vw] h-[100vh] flex flex-col items-center justify-center gap-8">
      <div className="mt-auto">
        <ImageGlitch />
      </div>
      <div className="nav flex flex-col gap-0.5 sm:gap-2 mt-auto mb-auto translate-y-[25vh]">
        <NavLink href="/music" icon="/music.png">
          Music
        </NavLink>
        <NavLink href="/" icon="/videos.png">
          Videos
        </NavLink>
        <NavLink href="/" icon="/shows.png">
          Shows
        </NavLink>
        <NavLink href="/" icon="/merch.png">
          Merch
        </NavLink>
      </div>
      <Footer />
    </div>
  );
}
