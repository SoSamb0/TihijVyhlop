"""Собирает один HTML: встраивает звуки (src/sounds.json) и титры (src/credits.json) в src/game_src.html."""
import os
here = os.path.dirname(os.path.abspath(__file__))
rd = lambda n: open(os.path.join(here, n), encoding="utf-8").read()
src = rd("game_src.html").replace("/*__SOUNDS__*/null", rd("sounds.json")).replace("/*__CREDITS__*/[]", rd("credits.json"))
out = os.path.join(here, "..", "tihiy_vyhlop.html")
open(out, "w", encoding="utf-8").write(src)
print("ok, KB:", os.path.getsize(out) // 1024)
