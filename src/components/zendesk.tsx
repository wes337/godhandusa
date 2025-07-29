import Script from "next/script";

export default function Zendesk() {
  return (
    <>
      <Script
        id="ze-snippet"
        src="https://static.zdassets.com/ekr/snippet.js?key=cf6b6b6b-5713-4606-ab9f-40c0f3b4073d"
        strategy="lazyOnload"
      />
      <Script id="zendesk-settings" strategy="lazyOnload">
        {`
          window.zESettings = {
            webWidget: { launcher: { mobile: { labelVisible: true } } },
          };
        `}
      </Script>
    </>
  );
}
