import Link from "next/link";
import Image from "next/image";
import Shopify from "@/lib/shopify";
import Footer from "@/components/footer";
import "./faq.css";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function FAQ() {
  const faq = await Shopify.getPageByHandle("contact");

  if (!faq) {
    return (
      <div className="faq">
        <h1 className="title">404</h1>
        <div className="content" style={{ textAlign: "center" }}>
          This page could not be found.
        </div>
      </div>
    );
  }

  return (
    <div className="faq">
      <Link href="/" className="logo">
        <Image
          src={`/hand-small-green.png`}
          alt="GODHANDUSA"
          width={327}
          height={378}
        />
      </Link>
      <h1 className="title">FAQ</h1>
      <div className="content" dangerouslySetInnerHTML={{ __html: faq.body }} />
      <Footer />
    </div>
  );
}
