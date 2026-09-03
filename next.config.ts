import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Content images are served from public/media/ and optimised by
       next/image, with intrinsic dimensions supplied by frontmatter so there
       is no layout shift before or after a real file lands. */
    formats: ["image/avif", "image/webp"],
  },

  /* ==========================================================================
     REDIRECTS
     ==========================================================================
     Two generations of old URLs point here, and nothing is allowed to 404:

       1. The Adobe Portfolio slugs, organised by medium. Those categories are
          now anchored sections inside /archive, so each old path redirects to
          its section anchor.
       2. This site's own previous structure — /work was a section index and
          /full-stack-development was a category. Both are gone: the work
          itself is on the home page and /archive.

     All permanent (308). Anchors survive a 308 because the fragment is never
     sent to the server — the browser reapplies it to the destination.
     ======================================================================== */
  async redirects() {
    return [
      /* ---- This site's previous structure ---- */
      { source: "/work", destination: "/", permanent: true },
      {
        source: "/full-stack-development",
        destination: "/work/drawevolve",
        permanent: true,
      },

      /* ---- Adobe Portfolio slugs -> archive sections ---- */
      { source: "/social-media", destination: "/archive#marketing", permanent: true },
      { source: "/spreads", destination: "/archive#print", permanent: true },
      {
        source: "/illlustrations",
        destination: "/archive#personal-works",
        permanent: true,
      },
      /* The typo'd path almost certainly has a correctly-spelled twin in the
         wild, from anyone who retyped it by hand. */
      {
        source: "/illustrations",
        destination: "/archive#personal-works",
        permanent: true,
      },
      { source: "/animations", destination: "/archive#motion-graphics", permanent: true },
      { source: "/motion", destination: "/archive#motion-graphics", permanent: true },
      { source: "/3d", destination: "/archive#3d-graphics", permanent: true },

      /* /abbott is a client name rather than a medium. Confirmed by the
         author: the work is 3D product visualization. */
      { source: "/abbott", destination: "/archive#3d-graphics", permanent: true },
    ];
  },
};

export default nextConfig;
