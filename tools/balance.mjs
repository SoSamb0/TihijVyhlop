// Прогоняет бота по всем уровням в headless-браузере и печатает таблицу баланса.
// Запуск: npm run balance            (по умолчанию 20 прогонов на уровень)
//         npm run balance -- 40      (свой N)
// В GitHub Actions таблица попадает в сводку job'а (GITHUB_STEP_SUMMARY).
import { chromium } from "playwright";
import { readFileSync, appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const N = Number(process.argv[2]) || 20;
// PW_CHANNEL=msedge или chrome — взять установленный браузер вместо скачанного Chromium
const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", e => errors.push(e.message));
await page.goto(pathToFileURL(resolve("index.html")).href);
await page.evaluate(readFileSync("src/bot.js", "utf8"));

const pct = v => `${Math.round(v * 100)}%`;
const table = mode => {
  const opts = { spam: { spam: true }, nofan: { nofan: true }, smart: {} }[mode];
  return page.evaluate(([n, o]) => runAll(n, o), [mode === "spam" ? Math.max(4, N / 4) : N, opts]);
};
const smart = await table("smart");
const nofan = await table("nofan");
const spam = await table("spam");
const goals = await page.evaluate(n => runGoals(n), Math.max(8, Math.round(N * 0.6)));
await browser.close();

let md = `## Баланс (бот, ${N} прогонов на уровень)\n\n| # | Уровень | Победы | Подозр. | Лопнул | Раскрыт | Без отгона облака | Спам слабыми | Доп. цели |\n|---|---|---|---|---|---|---|---|---|\n`;
smart.rows.forEach((r, i) => {
  md += `| ${r.n} | ${r.name} | **${pct(r.win)}** | ${r.sus ?? "—"}% | ${pct(r.burst)} | ${pct(r.caught)} | ${pct(nofan.rows[i].win)} | ${pct(spam.rows[i].win)} | ${r.goals.map(pct).join(" / ")} |\n`;
});
md += `\nБесконечный режим: бот держится в среднем **${smart.endless} с**.\n`;
md += `\n### Доп. цели (бот целенаправленно пытается выполнить каждую)\n\n| # | Уровень | Цель | Выполнил |\n|---|---|---|---|\n`;
goals.forEach(g => { md += `| ${g.n} | ${g.level} | ${g.goal} | ${g.rate > 0 ? "" : "❌ "}${pct(g.rate)} |\n`; });
if (errors.length) md += `\n### Ошибки на странице\n\n${errors.map(e => "- " + e).join("\n")}\n`;
console.log(md);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);

// провал, если игра падает, уровень стал непроходимым / слишком лёгким для спама или доп. цель невыполнима
const bad = [];
goals.forEach(g => { if (g.rate === 0) bad.push(`доп. цель «${g.goal}» (уровень ${g.n}) бот не выполнил ни разу`); });
if (errors.length) bad.push("ошибки JavaScript на странице");
smart.rows.forEach(r => { if (r.win < 0.05) bad.push(`уровень ${r.n} почти непроходим (${pct(r.win)})`); });
spam.rows.forEach(r => { if (r.n > 1 && r.win > 0.5) bad.push(`уровень ${r.n} проходится спамом (${pct(r.win)})`); });
if (bad.length) { console.error("ПРОБЛЕМЫ:\n- " + bad.join("\n- ")); process.exit(1); }
