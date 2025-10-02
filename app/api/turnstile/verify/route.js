// export async function POST(req: Request) {
//   const { token } = await req.json();
//   const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
//     method: "POST",
//     headers: { "content-type": "application/x-www-form-urlencoded" },
//     body: `secret=${encodeURIComponent(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!)}&response=${encodeURIComponent(token)}`,
//   });
//   const data = await res.json();
// //   return Response.json(data, { status: data.success ? 200 : 400 });
// // in /api/turnstile/verify/route.ts after success
// if (data.success) {
//   const resp = Response.json({ success: true });
//   resp.headers.append("Set-Cookie", `cfv=1; Path=/; Max-Age=${60*60*24}; HttpOnly; Secure; SameSite=Lax`);
//   return resp;
// }

// }


// app/api/turnstile/verify/route.js

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token } = await request.json();

    const body = new URLSearchParams();
    body.append("secret", process.env.CLOUDFLARE_SECRET);
    body.append("response", token);

    const cf = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      }
    );

    const data = await cf.json();

    if (!data.success) {
      return NextResponse.json({ success: false, ...data }, { status: 400 });
    }

    const res = NextResponse.json({ success: true }, { status: 200 });
    res.cookies.set({
      name: "cfv",
      value: "1",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });
    return res;
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "server_error" },
      { status: 500 }
    );
  }
}












// app/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import TurnstileWidget from "@/components/TurnstileWidget";

// export default function Landing() {
//   const [verified, setVerified] = useState(false);
//   useEffect(() => {
//     setVerified(document.cookie.includes("cfv=1"));
//   }, []);
//   return verified ? <MainHero /> : <TurnstileWidget onVerify={async (token) => {
//     const res = await fetch("/api/turnstile/verify", { method: "POST", body: JSON.stringify({ token }), headers: { "content-type": "application/json" } });
//     const data = await res.json();
//     if (data.success) location.reload(); // server will set cfv cookie
//   }} />;
// }
