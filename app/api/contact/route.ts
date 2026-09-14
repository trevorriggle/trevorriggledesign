import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/* ============================================================================
   POST /api/contact
   ============================================================================
   Takes the contact form, validates it, and sends one email through Resend.

   NO SDK. Resend's send endpoint is a single JSON POST, so this uses `fetch`
   rather than adding `resend` to the dependency list. That package exists to
   wrap exactly this call plus a React-email renderer this site does not use.
   One dependency not installed is one dependency not to update, not to audit,
   and not to have break a deploy.

   IT FAILS LOUDLY AND HONESTLY WHEN IT IS NOT CONFIGURED. With no
   RESEND_API_KEY it returns 503 and a message naming the email address, so a
   visitor who lands on an unconfigured deploy is told where to write instead
   of watching a spinner. It does NOT pretend to have sent anything. A contact
   form that returns success without sending is the worst possible bug on this
   page, because nobody finds out: not the sender, who thinks they wrote, and
   not the owner, who thinks nobody did.

   VALIDATION RUNS HERE AND NOT ONLY IN THE BROWSER. The client validates too,
   for the immediate feedback, but a route handler that trusts the form it
   shipped is a route handler with no validation.

   THE ANTI-SPAM IS TWO CHEAP CHECKS AND NOT A RATE LIMITER. A honeypot field
   that a human never sees and a bot fills in, and a minimum time on the form.
   Both cost nothing and catch the undirected bots that find a form by
   crawling. A real rate limiter needs a shared store, which on Vercel means
   provisioning KV or Upstash for a personal site's contact form, and that is
   a cost worth paying only once this is actually being abused. The daily
   ceiling that matters is on the Resend account.

   REPLY-TO CARRIES THE SENDER, and the From address is the verified domain.
   Putting a stranger's address in From is what gets a sending domain's
   reputation burned: the receiving server sees a domain sending mail claiming
   to be from gmail.com and treats it accordingly. Reply-To is the field that
   makes "reply" go to the right place, which is all anybody actually wants.
   ========================================================================= */

/** Hard caps. Generous for a human, and a bounded parse for everyone else. */
const LIMITS = { name: 100, email: 254, message: 5000 } as const;

/** Minimum seconds on the form. A human cannot type a message in two. */
const MIN_SECONDS = 2;

/* Deliberately loose. Email validation by regex is a well-known way to reject
   real addresses, so this checks the shape (something, an @, a dot in the
   domain) and lets the send be the real test. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** The honeypot. Hidden from people, irresistible to bots. */
  company?: unknown;
  /** Client clock, ms, stamped when the form mounted. */
  startedAt?: unknown;
};

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  /* Strip control characters: they are never in a real name or address and
     they are how header injection is attempted. */
  return value.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { error: "That request could not be read. Please try again." },
      { status: 400 },
    );
  }

  /* The honeypot. A real browser never fills this: it is off screen and
     marked not to autocomplete. Answer 200 rather than 400, so a bot learns
     nothing about why it failed and does not retry with the field removed. */
  if (clean(body.company, 200) !== "") {
    return NextResponse.json({ ok: true });
  }

  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
  if (startedAt > 0 && Date.now() - startedAt < MIN_SECONDS * 1000) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const message = clean(body.message, LIMITS.message);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please add your name.";
  if (!email) errors.email = "Please add your email address.";
  else if (!EMAIL.test(email)) errors.email = "That does not look like an email address.";
  if (!message) errors.message = "Please add a message.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO || site.email;

  /* NOT CONFIGURED. 503, not 500: the service is unavailable, the request was
     fine. The message names the address so the visitor is not stranded. */
  if (!key || !from) {
    return NextResponse.json(
      {
        error: `The form is not connected yet. Please email ${site.email} directly.`,
      },
      { status: 503 },
    );
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        /* The sender's own address, so hitting reply in a mail client goes
           to them. See the note at the top about why it is not `from`. */
        reply_to: email,
        subject: `Portfolio enquiry from ${name}`,
        text: `${name} <${email}>\n\n${message}`,
        html:
          `<p><strong>${safeName}</strong> &lt;${safeEmail}&gt;</p>` +
          `<p style="white-space:pre-wrap">${safeMessage}</p>`,
      }),
    });

    if (!response.ok) {
      /* Log the provider's reason server-side; never return it. A provider
         error body can name the account, the domain and the key's prefix. */
      console.error(
        "contact: resend returned",
        response.status,
        await response.text().catch(() => ""),
      );
      return NextResponse.json(
        {
          error: `That did not send. Please email ${site.email} directly.`,
        },
        { status: 502 },
      );
    }
  } catch (cause) {
    console.error("contact: send failed", cause);
    return NextResponse.json(
      { error: `That did not send. Please email ${site.email} directly.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
