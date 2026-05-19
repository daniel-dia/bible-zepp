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
      str += String.fromCharCode(
        ((b & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)
      );
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
    if (!stat || !stat.size) return null;
    const fd = openAssetsSync({ path, flag: O_RDONLY });
    const buf = new ArrayBuffer(stat.size);
    readSync({ fd, buffer: buf, options: { length: stat.size, offset: 0 } });
    closeSync({ fd });
    return decodeUtf8(new Uint8Array(buf));
  } catch (e) {
    console.error(`[fs-helper] Error reading "${path}":`, e && e.message ? e.message : e);
    return null;
  }
}

export function readChapter(bookIndex, chapterIndex) {
  const text = readText(`data/${bookIndex}/${chapterIndex}.txt`);
  if (!text) return null;
  return text.split("\n").filter((line) => line.length > 0);
}
