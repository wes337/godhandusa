import Link from "next/link";
import Image from "next/image";
import Shopify from "@/lib/shopify";
import { toCamelCase } from "@/utils";
import "./policy.css";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Policy({ params }) {
  const policyName = toCamelCase(params.policy);
  const policies = await Shopify.getAllPolicies();
  const policy = policies[policyName];

  if (!policy) {
    return (
      <div className="policy">
        <h1 className="title">404</h1>
        <div className="content" style={{ textAlign: "center" }}>
          This page could not be found.
        </div>
      </div>
    );
  }

  return (
    <div className="policy">
      <Link href="/" className="logo">
        <Image
          src={`/hand-small-green.png`}
          alt="GODHANDUSA"
          width={327}
          height={378}
        />
      </Link>
      <h1 className="title">{policy.title}</h1>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: policy.body }}
      />
    </div>
  );
}
