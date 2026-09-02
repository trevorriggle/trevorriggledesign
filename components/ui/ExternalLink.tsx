import styles from "./ExternalLink.module.css";

/* ============================================================================
   EXTERNAL LINK
   ============================================================================
   Every off-site link on the site renders through here, with the correct
   rel and a visible external mark.

   The href is asserted absolute at runtime as well as in the schema. The
   schema covers content frontmatter; this catches an absolute-URL mistake in
   hand-written page code or MDX, which the schema never sees. Both layers
   exist because this exact bug — a relative path in a "Live demo" link,
   resolving against the portfolio's own domain — is the one the old site
   shipped on every case study.
   ========================================================================= */

export function ExternalLink({
  href,
  children,
  showHost = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  /** Print the hostname after the label, in mono. */
  showHost?: boolean;
  className?: string;
}) {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    throw new Error(
      `ExternalLink: "${href}" is not an absolute URL. A relative path here ` +
        `resolves against this site and 404s. Use a full https:// URL.`,
    );
  }
  if (url.protocol !== "https:" && url.protocol !== "mailto:") {
    throw new Error(
      `ExternalLink: "${href}" must use https: or mailto: (got ${url.protocol}).`,
    );
  }

  const isMail = url.protocol === "mailto:";

  return (
    <a
      href={href}
      className={[styles.link, className].filter(Boolean).join(" ")}
      {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
    >
      <span>{children}</span>
      <span className={styles.mark} aria-hidden="true">
        {isMail ? "@" : "↗"}
      </span>
      {showHost && !isMail && (
        <span className={styles.host}>{url.hostname.replace(/^www\./, "")}</span>
      )}
      {!isMail && <span className="visually-hidden"> (opens in a new tab)</span>}
    </a>
  );
}
