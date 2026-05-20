import { localStorage } from "@zos/storage";

const KEY = "read_progress";

function load() {
  return localStorage.getItem(KEY) || {};
}

function save(progress) {
  localStorage.setItem(KEY, progress);
}

export function markChapterRead(bookIndex, chapterIndex) {
  const progress = load();
  if (!progress[bookIndex]) progress[bookIndex] = {};
  progress[bookIndex][chapterIndex] = 1;
  save(progress);
}

export function isChapterRead(bookIndex, chapterIndex) {
  const progress = load();
  return !!(progress[bookIndex] && progress[bookIndex][chapterIndex]);
}

export function getBookProgress(bookIndex, totalChapters) {
  const progress = load();
  const bookData = progress[bookIndex] || {};
  const read = Object.keys(bookData).length;
  return {
    read,
    total: totalChapters,
    percent: totalChapters > 0 ? Math.round((read / totalChapters) * 100) : 0,
  };
}

export function markAllRead(bookIndex, totalChapters) {
  const progress = load();
  const chapters = {};
  for (let i = 0; i < totalChapters; i++) chapters[i] = 1;
  progress[bookIndex] = chapters;
  save(progress);
}

export function markAllUnread(bookIndex) {
  const progress = load();
  delete progress[bookIndex];
  save(progress);
}

export function clearAllProgress() {
  save({});
}
