import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Content images are served from public/media/ and optimised by
       next/image, with intrinsic dimensions supplied by frontmatter so there
       is no layout shift before or after a real file lands. */
    formats: ["image/avif", "image/webp"],
  },

  /* Legacy URLs from the old Adobe Portfolio site.
     Those slugs never matched their labels — /social-media was the Marketing
     work, /spreads was Print, and /illlustrations was Personal Works with the
     typo baked into the URL. The clean slugs are the section ids, and these
     redirects keep every old inbound link and résumé PDF working.

     Add a line per old path as more turn up in analytics. */
  async redirects() {
    return [
      { source: "/social-media", destination: "/work#marketing", permanent: true },
      { source: "/spreads", destination: "/work#print", permanent: true },
      { source: "/illlustrations", destination: "/work#personal-works", permanent: true },
      /* The typo'd path almost certainly has a correctly-spelled twin in the
         wild, from anyone who retyped it by hand. */
      { source: "/illustrations", destination: "/work#personal-works", permanent: true },
      { source: "/motion", destination: "/work#motion-graphics", permanent: true },
      { source: "/3d", destination: "/work#3d-graphics", permanent: true },
    ];
  },
};

export default nextConfig;
