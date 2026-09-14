import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/* Every group folder that ever had a route, as {category, group}.
   public/design/<category>/NN-<group>/ is the same convention
   lib/design-images.ts reads, and the numeric prefix never reached the URL.

   READ OFF THE DISK RATHER THAN LISTED BY HAND, so this cannot drift from the
   folders the way a hand-maintained redirect map does. It is the same
   folder-is-the-config contract the design side has always run on. */
function designGroupRedirects() {
  const root = path.join(process.cwd(), "public", "design");
  if (!fs.existsSync(root)) return [];

  const out: { source: string; destination: string; permanent: true }[] = [];

  for (const category of fs.readdirSync(root, { withFileTypes: true })) {
    if (!category.isDirectory()) continue;

    for (const group of fs.readdirSync(path.join(root, category.name), {
      withFileTypes: true,
    })) {
      if (!group.isDirectory()) continue;
      const match = /^\d{1,3}-(.+)$/.exec(group.name);
      if (!match) continue;

      out.push({
        source: `/design/${category.name}/${match[1]}`,
        destination: `/design/${category.name}#${match[1]}`,
        permanent: true,
      });
    }
  }

  return out;
}

const nextConfig: NextConfig = {
  images: {
    /* Content images are served from public/media/ and optimised by
       next/image, with intrinsic dimensions supplied by frontmatter so there
       is no layout shift before or after a real file lands. */
    formats: ["image/avif", "image/webp"],
  },

  /* One redirect. /work was this site's own previous index route and is the
     only old path with a certain destination. It pointed at `/` while the
     home page WAS the list of applications; now that home is a 2x2 of four
     doors, the honest destination is /applications, which is the page /work
     actually was.

     The Adobe Portfolio category redirects are gone. They were guesses at
     which old slug mapped to which medium, they pointed at an /archive route
     that no longer exists, and a redirect map maintained on speculation is
     worse than a 404: it sends someone confidently to the wrong page. The 404
     hands over the site index, which is the honest answer for a URL nobody
     can confirm ever existed.

     The design group redirect below is the opposite case and meets that bar:
     those routes existed, this repository generated them, and the destination
     is the same content at a new address. */
  async redirects() {
    return [
      { source: "/work", destination: "/applications", permanent: true },

      /* THE GROUP ROUTES BECAME ANCHORS. /design/<category>/<group> was a real
         page per folder; a category is now one page with a section per folder,
         so each old route resolves to its section on the parent.

         ENUMERATED, NOT WILDCARDED, AND THAT IS THE WHOLE POINT. The obvious
         version of this is one rule, `/design/:category/:group` to
         `/design/:category#:group`, and it is wrong: it matches ANY third
         segment, so a URL nobody ever published gets a 308 telling the world
         it moved permanently to a section that does not exist. That is the
         failure the note above rejects the Adobe redirects for, rebuilt in
         one line. `/design/american-scientific/not-a-group` should 404, and
         with the list below it does.

         These eight are not speculative: each was a route this site built and
         served from `generateStaticParams` over the same folders this list is
         read from, and the fragment is the slug the section head now carries
         as its id.

         `permanent: true` is a 308, which is correct: the two-tier structure
         is gone, not temporarily unavailable.

         A FRAGMENT DOES NOT REACH THE SERVER, so this redirects to the page
         and the browser applies the hash on arrival. That is the only way a
         server-side redirect can target a section, and it works here because
         the ids are in the server-rendered HTML rather than added after
         hydration. */
      ...designGroupRedirects(),
    ];
  },
};

export default nextConfig;
