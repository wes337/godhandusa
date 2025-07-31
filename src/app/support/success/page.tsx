import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/footer";
import "../support.css";

export default function SupportSuccess() {
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
      <h1 className="title">Thank you!</h1>
      <div className="body">
        Your support ticket has been submitted. We&apos;ll be in touch soon
        regarding your request.
      </div>
      <Footer />
    </div>
  );
}
