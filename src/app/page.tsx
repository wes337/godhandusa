import Link from "next/link";
import Footer from "./components/footer";
import SplashImage from "./components/splash-image";
import "./home.css";

export const metadata = {
  title: "GODHANDUSA",
};

export default function Home() {
  return (
    <div className="home">
      <SplashImage />
      <div className="nav">
        <Link href="/music">Music</Link>
        <Link href="/videos">Videos</Link>
        <Link href="/">Shows</Link>
        <Link href="/">Merch</Link>
      </div>
      <Footer />
    </div>
  );
}
