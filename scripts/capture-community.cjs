/**
 * capture-community.cjs: full-page screenshots of the community websites for the
 * "Off the clock" section, saved as WebP in public/community/.
 *
 *   node scripts/capture-community.cjs
 *
 * Needs the Playwright dev dependency (`npx playwright install chromium`) and
 * Python 3 + Pillow for the WebP conversion.
 */
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const OUT = path.join(__dirname, "..", "public", "community");
const MAX_H = 3600; // px of page height kept (at 1280 wide)
const SITES = {
  volta: "https://voltarunclub.es/",
  activemarmenor: "https://activemarmenor.eu/",
  seijas: "https://seijasfitbox.com/",
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "community-"));
  const browser = await chromium.launch();
  for (const [id, url] of Object.entries(SITES)) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: "es-ES" });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    // dismiss cookie banners (reject non-essential where offered)
    for (const label of ["Rechazar", "Reject", "Aceptar", "Accept"]) {
      const btn = page.getByRole("button", { name: new RegExp(`^${label}`, "i") }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {});
        break;
      }
    }
    // scroll through the page so lazy images and reveal animations load
    await page.evaluate(async (max) => {
      for (let y = 0; y < Math.min(document.body.scrollHeight, max); y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 180));
      }
      window.scrollTo(0, 0);
    }, MAX_H);
    await page.waitForTimeout(1500);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    const png = path.join(tmp, `${id}.png`);
    await page.screenshot({ path: png, clip: { x: 0, y: 0, width: 1280, height: Math.min(h, MAX_H) }, fullPage: true });
    await ctx.close();
    execFileSync("python3", [
      "-c",
      "import sys;from PIL import Image;im=Image.open(sys.argv[1]).convert('RGB');w=720;im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS);im.save(sys.argv[2],'WEBP',quality=74,method=6)",
      png,
      path.join(OUT, `${id}.webp`),
    ]);
    console.log(`${id}: ${url} → public/community/${id}.webp`);
  }
  await browser.close();
})();
