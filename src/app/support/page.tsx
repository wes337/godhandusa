import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/footer";
import SupportForm from "./form";
import "./support.css";

export default async function Support() {
  return (
    <div className="support">
      <Link href="/" className="logo">
        <Image
          src={`/hand-small-green.png`}
          alt="GODHANDUSA"
          width={327}
          height={378}
        />
      </Link>
      <h1 className="title">Support</h1>
      <SupportForm />
      <Footer />
    </div>
  );
}
