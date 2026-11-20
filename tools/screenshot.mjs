// Делает скриншоты для README: docs/screenshot.png (игра) и docs/levels.png (выбор уровня).
// Запуск: npm run screenshot
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

mkdirSync("docs", { recursive: true });
// PW_CHANNEL=msedge или chrome — взять установленный браузер вместо скачанного Chromium
const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(pathToFileURL(resolve("index.html")).href);
await page.waitForTimeout(800);

// кадр из игры: метро, только что был залп, облако летит к деду
await page.evaluate(() => {
  muted = true; startLevel(1);
  G.evs.forEach(e => { e.next = 999; });
  G.active.push({ def: LEVELS[1].events[2], t: 0, dur: 4 }); // скрежет в тоннеле: громко
  for (let i = 0; i < 30 * 0.6; i++) update(1 / 30);
  G.P = 75; G.power = 62; releaseFart(false);
  for (let i = 0; i < 30 * 1.1; i++) update(1 / 30);
  G.charging = true; G.power = 38;
  mode = "pause";
});
await page.waitForTimeout(400);
await page.screenshot({ path: "docs/screenshot.png" });

await page.evaluate(() => { save.unlocked = 11; save.goals = { home: [true, true, false], metro: [true] }; save.stars = { home: 3, metro: 2 }; buildLevels(); show("ovLevels"); mode = "levels"; });
await page.waitForTimeout(400);
await page.screenshot({ path: "docs/levels.png" });
await browser.close();
console.log("docs/screenshot.png, docs/levels.png");
