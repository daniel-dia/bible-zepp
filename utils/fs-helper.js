import { openAssetsSync, readSync, statAssetsSync, O_RDONLY, closeSync } from "@zos/fs";

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
    console.error(`Error reading ${path}:`, e);
    return null;
  }
}

export function readChapter(bookIndex, chapterIndex) {
  const text = readText(`data/${bookIndex}/${chapterIndex}.txt`);
  if (!text) return null;
  return text.split("\n").filter((line) => line.length > 0);
}
