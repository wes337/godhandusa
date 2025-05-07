import ImageGlitch from "./image-glitch";
import NavLink from "./link";

export const metadata = {
  title: "GODHANDUSA",
};

export default function Home() {
  return (
    <div className="fillAvailable w-[100vw] h-[100vh] flex flex-col items-center justify-center gap-8">
      <div className="mt-auto">
        <ImageGlitch />
      </div>
      <div className="flex flex-col gap-2 mt-auto mb-auto translate-y-[25vh]">
        <NavLink href="/" icon="/music.png">
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
      <div className="footer font-mono mt-auto mb-4 text-xs uppercase text-white text-center tracking-tighter whitespace-nowrap">
        Copyright © 2025 GODHANDUSA® All Rights Reserved
      </div>
    </div>
  );
}
