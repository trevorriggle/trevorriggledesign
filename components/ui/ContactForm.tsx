"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "./ContactForm.module.css";

/* ============================================================================
   CONTACT FORM
   ============================================================================
   Name, email, message. Posts JSON to /api/contact, which validates again and
   sends through Resend.

   THE MAILTO LINK IS NOT A FALLBACK, IT IS THE OTHER OPTION, and it lives
   outside this component on the page. That ordering matters: plenty of people
   would rather write from their own client where they have their signature
   and a record of having sent it. A form that makes the address hard to find
   is optimising for the owner's inbox tooling over the sender.

   ERRORS ARE SPECIFIC AND THEY NAME THE WAY OUT. Every failure path ends with
   the email address, because the one unacceptable outcome on this page is a
   person who wanted to make contact and could not. A 503 from an
   unconfigured deploy says so plainly rather than spinning.

   SUCCESS IS A STATE, NOT A REDIRECT. The form is replaced in place by a
   confirmation that repeats what was sent to where. No navigation, so the
   back button still does what it did, and nothing is lost if the confirmation
   is missed.

   THE STATUS REGION IS `aria-live="polite"` AND IT IS IN THE DOM FROM THE
   START. A live region added to the page at the same moment it gets its first
   content is frequently not announced at all, because the screen reader never
   observed it becoming non-empty. It ships empty and is filled.

   VALIDATION RUNS IN BOTH PLACES. Here for immediate feedback with no round
   trip, and in the route handler because a server that trusts its own form is
   not validating. The messages are written once, in `validate`, and the
   server's are worded the same way so a person does not get two different
   sentences about one mistake.

   `noValidate` TURNS OFF THE BROWSER'S OWN BUBBLES on purpose. Native
   validation cannot be styled, disappears on blur, is not tied to the field
   with aria-describedby, and speaks the browser UI's language rather than the
   page's. The `type` and `required` attributes stay, because they still drive
   the mobile keyboard and are what a form reads as without JavaScript.
   ========================================================================= */

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: { name: string; email: string; message: string }): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Please add your name.";
  if (!values.email.trim()) errors.email = "Please add your email address.";
  else if (!EMAIL.test(values.email.trim()))
    errors.email = "That does not look like an email address.";
  if (!values.message.trim()) errors.message = "Please add a message.";
  return errors;
}

export function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState("");
  const [sentTo, setSentTo] = useState("");

  /* Stamped once on mount and sent with the payload. The route rejects
     anything submitted within two seconds of the form appearing, which is a
     bot, not a person who types fast. */
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStatus("idle");
      /* Move focus to the first thing that is wrong. Without this, a keyboard
         or screen reader user is told the form failed and left at the submit
         button with no idea which field to go back to. */
      const first = (Object.keys(found) as Array<keyof Errors>)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setFailure("");
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          company: String(data.get("company") ?? ""),
          startedAt: startedAt.current,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        errors?: Errors;
      };

      if (response.ok && payload.ok) {
        setSentTo(values.email.trim());
        setStatus("sent");
        return;
      }

      if (payload.errors) {
        setErrors(payload.errors);
        setStatus("idle");
        return;
      }

      setFailure(
        payload.error ?? `That did not send. Please email ${email} directly.`,
      );
      setStatus("error");
    } catch {
      /* Offline, DNS, a blocked request. Never a stack trace at the reader. */
      setFailure(
        `That did not send, which may be the connection. Please email ${email} directly.`,
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className={styles.done} role="status">
        <p className={styles.doneHeading}>Sent.</p>
        <p className={styles.doneLine}>
          That is with me, and I will reply to {sentTo}.
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          autoComplete="name"
          disabled={sending}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={styles.input}
        />
        {errors.name && (
          <p id="name-error" className={styles.fieldError}>
            {errors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          disabled={sending}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={styles.input}
        />
        {errors.email && (
          <p id="email-error" className={styles.fieldError}>
            {errors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={7}
          maxLength={5000}
          disabled={sending}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={styles.textarea}
        />
        {errors.message && (
          <p id="message-error" className={styles.fieldError}>
            {errors.message}
          </p>
        )}
      </div>

      {/* THE HONEYPOT. Off screen rather than `display: none`, because some
          bots skip hidden fields. `tabIndex={-1}` and `aria-hidden` keep it
          away from keyboards and screen readers, and the label is real so
          nothing reads as an unlabelled input. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={sending}>
          {sending ? "Sending" : "Send"}
        </button>
      </div>

      {/* Empty in the DOM from first render. See the note at the top. */}
      <p
        className={styles.status}
        role="status"
        aria-live="polite"
        data-state={status}
      >
        {status === "error" ? failure : ""}
      </p>
    </form>
  );
}
