import { openAssetsSync, readSync, statAssetsSync, O_RDONLY, closeSync } from "@zos/fs";

function decodeUtf8(bytes) {
  let str = "";
  let i = 0;
  while (i < bytes.length) {
    const b = bytes[i];
    if (b < 0x80) {
      str += String.fromCharCode(b);
      i += 1;
    } else if ((b & 0xe0) === 0xc0) {
      str += String.fromCharCode(((b & 0x1f) << 6) | (bytes[i + 1] & 0x3f));
      i += 2;
    } else if ((b & 0xf0) === 0xe0) {
      str += String.fromCharCode(((b & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f));
      i += 3;
    } else {
      i += 1;
    }
  }
  return str;
}

function readText(path) {
  try {
    const stat = statAssetsSync({ path });
    console.log(`[fs-helper] stat("${path}"):`, JSON.stringify(stat));
    if (!stat || !stat.size) return null;
    const fd = openAssetsSync({ path, flag: O_RDONLY });
    console.log(`[fs-helper] fd:`, fd);
    const buf = new ArrayBuffer(stat.size);
    readSync({ fd, buffer: buf, options: { length: stat.size, offset: 0 } });
    closeSync({ fd });
    const text = decodeUtf8(new Uint8Array(buf));
    console.log(`[fs-helper] read ${text.length} chars, preview: "${text.slice(0, 40)}"`);
    return text;
  } catch (e) {
    console.error(`[fs-helper] Error reading "${path}":`, e && e.message ? e.message : e);
    return null;
  }
}

export function readChapter(bookIndex, chapterIndex) {
  const path = `data/${bookIndex}/${chapterIndex}.txt`;
  console.log(`[fs-helper] readChapter(${bookIndex}, ${chapterIndex}) -> "${path}"`);
  const text = readText(path);
  if (!text) {
    console.error(`[fs-helper] Chapter file not found: ${path}`);
    return null;
  }
  const verses = text.split("\n").filter(line => line.trim() !== "");
  console.log(`[fs-helper] parsed ${verses.length} verses`);
  return verses;
}
