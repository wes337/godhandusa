import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/footer";
import GlitchText from "@/components/glitch-text";
import StaticFlicker from "@/components/static-flicker";
import "./not-found.css";

export default function NotFound() {
  return (
    <div className="not-found">
      <StaticFlicker />
      <Link href="/" className="logo">
        <Image
          src={`/hand-small-green.png`}
          alt="GODHANDUSA"
          width={327}
          height={378}
        />
      </Link>
      <div className="terminal">
        <div className="terminal-body">
          <div className="code">
            <span>4</span>
            <span>0</span>
            <span>4</span>
          </div>
          <div className="line detail">
            <GlitchText label={"The page you are looking for"} />
          </div>
          <div className="line detail">
            <GlitchText label={"does not exist or has been moved"} />
          </div>
          <Link href="/" className="return">
            <GlitchText label={"Return Home"} hover />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
