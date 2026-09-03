import type { Metadata, Viewport } from "next";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { fontVariables } from "./fonts";
import { site } from "@/lib/site";
import "@/styles/global.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  /* ONE colour, unconditionally. There is no dark scheme on this site — it
     was removed, not disabled, so there is no media-query branch here either.
     The browser chrome matches the page ground on every device. */
  themeColor: "#faf8f5",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <a href="#main" className="visually-hidden skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
