#!/usr/bin/env node
/* ============================================================================
   VIEWPORT CHECK — responsive regression test.
   ============================================================================
   Walks every route at 375 / 768 / 1440 and asserts two things:

     · no horizontal overflow anywhere (documentElement.scrollWidth must not
       exceed clientWidth, and no element may be wider than the viewport)
     · the display type actually scales — it prints the computed h1 size,
       its line-height ratio and its multiple of the 17px body size

   The second half matters as much as the first. A type scale that collapses
   to body size on a phone has not survived; it has just stopped being a
   scale. At 375 the hero should hold its clamp FLOOR (57px), not shrink to
   nothing.

   Requires a headless browser, which is NOT installed by default — the
   dependency here is playwright-core, which ships no binaries:

       npx playwright install chromium
       pnpm build && pnpm start &
       node scripts/check-viewports.mjs

   Set CHROME_PATH if the browser is somewhere non-standard.
   ========================================================================= */

import { chromium } from "playwright-core";
import fs from "node:fs";

const shell =
  process.env.CHROME_PATH ??
  fs
    .readdirSync("/home/codespace/.cache/ms-playwright", { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("chromium-"))
    .map((d) => `/home/codespace/.cache/ms-playwright/${d.name}/chrome-linux64/chrome`)
    .find((p) => fs.existsSync(p));

if (!shell) {
  console.error(
    "  No chromium found. Run: npx playwright install chromium\n" +
      "  or set CHROME_PATH to a browser binary.",
  );
  process.exit(2);
}
const browser = await chromium.launch({ executablePath: shell });

const ROUTES = ["/", "/archive", "/about", "/contact", "/work/drawevolve", "/work/thoosie", "/work/lynk", "/no-such-page"];
const VIEWPORTS = [
  { name: "375px  phone ", width: 375, height: 800 },
  { name: "768px  tablet", width: 768, height: 1000 },
  { name: "1440px laptop", width: 1440, height: 900 },
];

let failures = 0;
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  console.log(`\n══ ${vp.name} ${"═".repeat(40)}`);
  for (const route of ROUTES) {
    await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const overflow = de.scrollWidth - de.clientWidth;
      // Any element wider than the viewport is a horizontal-scroll bug.
      const wide = [...document.querySelectorAll("body *")]
        .filter((el) => el.getBoundingClientRect().width > de.clientWidth + 1)
        .map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}`)
        .slice(0, 4);
      const h1 = document.querySelector("h1");
      const cs = h1 ? getComputedStyle(h1) : null;
      const body = getComputedStyle(document.body);
      return {
        overflow,
        wide,
        h1px: cs ? Math.round(parseFloat(cs.fontSize)) : null,
        h1lh: cs ? (parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2) : null,
        h1font: cs ? cs.fontFamily.split(",")[0].replace(/["']/g, "") : null,
        bodypx: Math.round(parseFloat(body.fontSize)),
        bg: body.backgroundColor,
        fg: body.color,
      };
    });
    const bad = r.overflow > 1 || r.wide.length > 0;
    if (bad) failures++;
    const ratio = r.h1px && r.bodypx ? (r.h1px / 17).toFixed(1) : "-";
    console.log(
      `  ${bad ? "OVERFLOW" : "ok      "} ${route.padEnd(18)} h1 ${String(r.h1px).padStart(3)}px  lh ${r.h1lh}  ${ratio}x body  ${r.h1font ?? ""}` +
      (bad ? `  ← +${r.overflow}px ${r.wide.join(", ")}` : "")
    );
  }
  await ctx.close();
}

await browser.close();

console.log(`\n${failures === 0 ? "PASS — no horizontal overflow at any viewport" : `FAIL — ${failures} overflow(s)`}`);
process.exit(failures === 0 ? 0 : 1);
