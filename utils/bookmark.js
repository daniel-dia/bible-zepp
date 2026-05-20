import { localStorage } from "@zos/storage";

const KEY = "last_reading";

export function saveBookmark(bookIndex, chapterIndex) {
  localStorage.setItem(KEY, { bookIndex, chapterIndex });
}

export function loadBookmark() {
  return localStorage.getItem(KEY) || null;
}
