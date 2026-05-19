import { openAssetsSync, readSync, O_RDONLY, closeSync } from "@zos/fs";

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

export function readChapter(bookIndex, chapterIndex) {
  try {
    const path = `data/${bookIndex}/${chapterIndex}.txt`;
    const fd = openAssetsSync({ path, flag: O_RDONLY });
    const buf = new ArrayBuffer(32768);
    const bytesRead = readSync({ fd, buffer: buf });
    closeSync({ fd });
    return decodeUtf8(new Uint8Array(buf, 0, bytesRead)).split("\n").filter(l => l.trim() !== "");
  } catch (e) {
    console.error(`[fs-helper] readChapter(${bookIndex}, ${chapterIndex}):`, e && e.message ? e.message : e);
    return null;
  }
}
