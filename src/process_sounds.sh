#!/usr/bin/env bash
# Обрабатывает скачанные записи: обрезка тишины, нормализация, моно 22 кГц, ogg + вариации высоты/скорости.
# Использование: process_sounds.sh <папка_с_исходниками> <папка_вывода>
set -u
IN="$1"; OUT="$2"
mkdir -p "$OUT/fart" "$OUT/rumble"
CLEAN='silence 1 0.02 1% reverse silence 1 0.02 1% reverse highpass 50 norm -1'
FMT='-c 1 -r 22050'
for f in "$IN"/*.*; do
  sz=$(stat -c %s "$f"); [ "$sz" -lt 5000 ] && continue
  head -c 20 "$f" | grep -q "<!DOC" && continue
  b=$(basename "$f"); id="${b%%.*}"
  if [ "$id" = "10" ]; then
    # запись с урчанием живота: режем на куски по 1.5 c как «урчание»
    for i in 0 1 2 3 4 5 6; do
      sox "$f" $FMT "$OUT/rumble/r${i}.ogg" trim $((i*2)) 1.6 highpass 40 lowpass 2500 norm -2 2>/dev/null
    done
    continue
  fi
  dur=$(sox "$f" -n stat 2>&1 | awk '/Length/ {print $3}')
  long=$(awk -v d="$dur" 'BEGIN{print (d>3.0)?1:0}')
  if [ "$long" = "1" ]; then
    # длинные записи режем на отдельные выхлопы по паузам
    sox "$f" $FMT "$OUT/fart/${id}_part.ogg" highpass 50 silence 1 0.03 2% 1 0.25 2% : newfile : restart 2>/dev/null
    for p in "$OUT/fart/${id}_part"*.ogg; do
      [ -f "$p" ] || continue
      pd=$(sox "$p" -n stat 2>&1 | awk '/Length/ {print $3}')
      if awk -v d="$pd" 'BEGIN{exit !(d<0.18 || d>4.5)}'; then rm -f "$p"; else sox "$p" "${p%.ogg}_n.ogg" norm -1 2>/dev/null && mv "${p%.ogg}_n.ogg" "$p"; fi
    done
  else
    sox "$f" $FMT "$OUT/fart/${id}.ogg" $CLEAN 2>/dev/null
  fi
done
# вариации: ниже/выше, быстрее/медленнее
for p in "$OUT/fart/"*.ogg; do
  case "$p" in *_v*) continue;; esac
  base="${p%.ogg}"
  sox "$p" "${base}_vlow.ogg" pitch -500 norm -1 2>/dev/null
  sox "$p" "${base}_vhigh.ogg" pitch 600 norm -1 2>/dev/null
  sox "$p" "${base}_vslow.ogg" speed 0.75 norm -1 2>/dev/null
  sox "$p" "${base}_vfast.ogg" speed 1.4 norm -1 2>/dev/null
done
ls -la "$OUT/fart" "$OUT/rumble"
