import Footer from "./components/footer";
import SplashImage from "./components/splash-image";
import NavLink from "./components/nav-link";
import "./home.css";

export const metadata = {
  title: "GODHANDUSA",
};

export default function Home() {
  return (
    <div className="home">
      <SplashImage />
      <div className="nav">
        <NavLink href="/music" label="Music" />
        <NavLink href="/videos" label="Videos" />
        <NavLink href="/shows" label="Shows" />
        <NavLink href="/merch" label="Merch" />
      </div>
      <Footer />
    </div>
  );
}
