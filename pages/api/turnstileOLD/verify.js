// pages/api/turnstile/verify.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Only POST allowed" });
    return;
  }

  try {
    const { token } = req.body;

    const params = new URLSearchParams();
    params.append("secret", process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
    params.append("response", token);

    const cf = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    const data = await cf.json();

    if (!data.success) {
      res.status(400).json({ success: false, ...data });
      return;
    }

    res.setHeader(
      "Set-Cookie",
      `cfv=1; Path=/; Max-Age=${60 * 60 * 24}; HttpOnly; Secure; SameSite=Lax`
    );
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: "server_error" });
  }
}
