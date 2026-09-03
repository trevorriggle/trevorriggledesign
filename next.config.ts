import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Content images are served from public/media/ and optimised by
       next/image, with intrinsic dimensions supplied by frontmatter so there
       is no layout shift before or after a real file lands. */
    formats: ["image/avif", "image/webp"],
  },

  /* One redirect. /work was this site's own previous index route and is the
     only old path with a certain destination.

     The Adobe Portfolio category redirects are gone. They were guesses at
     which old slug mapped to which medium, they pointed at an /archive route
     that no longer exists, and a redirect map maintained on speculation is
     worse than a 404: it sends someone confidently to the wrong page. The 404
     hands over the site index, which is the honest answer for a URL nobody
     can confirm ever existed. */
  async redirects() {
    return [{ source: "/work", destination: "/", permanent: true }];
  },
};

export default nextConfig;
