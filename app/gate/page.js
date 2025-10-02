"use client";

import TurnstileWidget from "@/components/TurnstileWidget";
// import Turnstile from "react-turnstile";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Gate() {
  const router = useRouter();
  const [err, setErr] = useState(null);

  async function onVerify(token) {
    setErr(null);
    const r = await fetch("/api/turnstile/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (r.ok) {
      router.replace("/"); // go to homepage after clearance
    } else {
      const j = await r.json().catch(() => ({}));
      setErr(j["error-codes"]?.[0] || "verification_failed");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b0b0b",
        color: "#eaeaea",
      }}
    >
      <div style={{ width: 360, textAlign: "center" }}>
        <h1 style={{ marginBottom: 12 }}>Please verify</h1>
        <p style={{ marginBottom: 16 }}>
          We must verify the session before continuing.
        </p>

        {/* <Turnstile
          sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onVerify={onVerify}
          // Managed mode shows a small box; Invisible would not show UI
          options={{ appearance: "always" }}
        /> */}
        <TurnstileWidget onVerify={onVerify} />

        {err && (
          <p style={{ color: "tomato", marginTop: 12 }}>
            Error: {String(err)}
          </p>
        )}
      </div>
    </main>
  );
}
