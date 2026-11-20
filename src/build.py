"""Собирает игру в один файл index.html (его и раздаёт GitHub Pages).

Берёт src/index.template.html и подставляет в него:
  src/style.css, все src/js/*.js в порядке ORDER, src/sounds.json, src/credits.json.
Запуск: python src/build.py
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ORDER = ["util", "save", "audio", "lines", "chars", "levels", "game", "scenes", "render", "story", "touch", "menu", "main"]


def rd(*p):
    return open(os.path.join(HERE, *p), encoding="utf-8").read()


js = "\n".join(f"// ---------- {n}.js ----------\n" + rd("js", n + ".js") for n in ORDER)
html = (rd("index.template.html")
        .replace("/*__CSS__*/", rd("style.css"))
        .replace("/*__JS__*/", js)
        .replace("/*__SOUNDS__*/null", rd("sounds.json"))
        .replace("/*__CREDITS__*/[]", rd("credits.json")))
out = os.path.join(HERE, "..", "index.html")
open(out, "w", encoding="utf-8", newline="\n").write(html)
print("index.html собран,", os.path.getsize(out) // 1024, "КБ")
