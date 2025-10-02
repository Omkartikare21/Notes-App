"use client";

import Turnstile from "react-turnstile";
import { useState } from "react";

export default function TurnstileWidget({ onVerify }) {
   const [siteKey] = useState(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY); // replace with your real sitekey

  return (
    <div>
      <Turnstile
        sitekey={siteKey}
        onVerify={onVerify}
        //refreshExpired="auto" // auto refresh when token expires
        onExpire={() => console.log("Turnstile token expired")}
        autoResetOnExpire
        onError={(err) => console.error("Turnstile error:", err)}
      />
    </div>
  );
}