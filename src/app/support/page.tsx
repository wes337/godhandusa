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
  const order = formData.get("order") as string;
  const body = formData.get("body") as string;
  const issue = formData.get("issue") as string;
  const uploads = [];
  const requester = { name, email };

  await Zendesk.createTicket(requester, issue, body, order, uploads);

  redirect("/support/success");
}

const ISSUES = [
  {
    label: "Where Is My Order?",
    tag: "where_is_my_order",
  },
  {
    label: "Redelivery or Lost Package",
    tag: "redelivery_or_lost_package",
  },
  {
    label: "Missing/Wrong Item In Package",
    tag: "missing/wrong_item_in_package",
  },
  {
    label: "Cancel/Edit Order Information",
    tag: "cancel/edit_order_information",
  },
  {
    label: "Damaged/Defective Product",
    tag: "damaged/defective_product",
  },
];

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
          <label htmlFor="issue">Issue Type</label>
          <select name="issue" required>
            {ISSUES.map(({ label, tag }) => (
              <option key={tag} value={tag}>
                {label}
              </option>
            ))}
          </select>
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
