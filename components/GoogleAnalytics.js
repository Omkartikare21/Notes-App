import Script from "next/script";

export const GoogleAnalytics = () => (
  <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GTAG}`} strategy="afterInteractive" />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', ${process.env.GTAG});
      `}
    </Script>
  </>
);
