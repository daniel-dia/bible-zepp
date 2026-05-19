#!/usr/bin/env node
// Gera assets/common.r/data e assets/common.s/data com arquivos .txt
// Formato: "1 versículo\n2 versículo\n..."
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const raw = fs.readFileSync(path.join(root, "nvi.json"), "utf8").replace(/^\uFEFF/, "");
const nvi = JSON.parse(raw);

const targets = ["common.r", "common.s"];

let total = 0;
nvi.forEach((book, bookIndex) => {
  book.chapters.forEach((verses, chapterIndex) => {
    const content = verses.map((v, i) => `${i + 1} ${v}`).join("\n");
    for (const profile of targets) {
      const dir = path.join(root, "assets", profile, "data", String(bookIndex));
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${chapterIndex}.txt`), content, "utf8");
    }
    total++;
  });
});

console.log(`Gerados ${total} capítulos × ${targets.length} perfis = ${total * targets.length} arquivos.`);
