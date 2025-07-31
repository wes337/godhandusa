import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import Zendesk from "@/lib/zendesk";
import Footer from "@/components/footer";
import "./support.css";

async function createSupportTicket(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  // const order = formData.get("order") as string;
  const subject = formData.get("subject") as string;
  const body = formData.get("body") as string;

  await Zendesk.createTicket({ name, email }, subject, body);

  redirect("/support/success");
}

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
      <form className="form" action={createSupportTicket}>
        <div>
          <label htmlFor="email">Email Address</label>
          <div className="subLabel">Email connected to the purchase. </div>
          <input type="email" name="email" required />
        </div>
        <div>
          <label htmlFor="name">Full Name</label>
          <div className="subLabel">Full name connected to the purchase.</div>
          <input type="text" name="name" required />
        </div>
        <div>
          <label htmlFor="order">Order number</label>
          <div className="subLabel">
            Your 4-5 digit order number. Appears in your confirmation email upon
            purchase - eg. #12345. Input number only (No &apos;#&apos; at the
            beginning). This is not your USPS tracking number or
            Invoice/Transaction ID.
          </div>
          <input type="text" name="order" />
        </div>
        <div>
          <label htmlFor="subject">Subject</label>
          <input type="text" name="subject" required />
        </div>
        <div>
          <label htmlFor="body">How can we help you?</label>
          <textarea name="body" rows={5} required />
        </div>
        <button type="submit">Send</button>
      </form>
      <Footer />
    </div>
  );
}
