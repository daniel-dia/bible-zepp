import * as hmUI from "@zos/ui";
import { replace, push } from "@zos/router";
import { BasePage } from "@zeppos/zml/base-page";
import { BOOKS } from "../../utils/bible-meta";
import { readChapter } from "../../utils/fs-helper";
import { saveBookmark } from "../../utils/bookmark";
import { markChapterRead } from "../../utils/progress";
import { loadSettings, FONT_SIZES, TEXT_COLORS, FONTS, MARGINS } from "../../utils/settings";
import { LAYOUT } from "zosLoader:./index.[pf].layout.js";
import { vstack, PADDING } from "../../utils/vstack";
import { COMMON_LAYOUT } from "../../utils/config/layout";

const { bgColor, pressColor, verseFontSize, navFontSize } = COMMON_LAYOUT;

function buildChapterRoute(bookIndex, chapterIndex) {
  return {
    url: "page/reading/index",
    params: JSON.stringify({ bookIndex, chapterIndex }),
  };
}

const ICON_W = PADDING * 8;

function buildHeader(bookName, chapterIndex) {
  hmUI.createWidget(hmUI.widget.TEXT, {
    x: 0,
    y: 0,
    w: LAYOUT.W - ICON_W,
    h: LAYOUT.headerH,
    text: `${bookName} ${chapterIndex + 1}`,
    text_size: hmUI.sp(26),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.CENTER_V,
  });

  hmUI.createWidget(hmUI.widget.BUTTON, {
    x: LAYOUT.W - ICON_W - PADDING,
    y: 0,
    w: ICON_W,
    h: LAYOUT.headerH,
    text: "⚙",
    text_size: hmUI.sp(20),
    // normal_color: 0x222222,
    press_color: bgColor,
    radius: PADDING,
    click_func: () => push({ url: "page/settings/index" }),
  });
}

function buildError() {
  hmUI.createWidget(hmUI.widget.TEXT, {
    x: PADDING,
    y: LAYOUT.headerH + PADDING,
    w: LAYOUT.W - PADDING * 2,
    h: PADDING * 5,
    text: "Erro ao carregar o capítulo.",
    color: COMMON_LAYOUT.color,
    text_size: verseFontSize,
    align_h: hmUI.align.CENTER_H,
    text_style: hmUI.text_style.WRAP,
  });
}

function buildNavButtons(chapterIndex, chaptersLength, bookIndex, startY) {
  const hasPrev = chapterIndex > 0;
  const hasNext = chapterIndex < chaptersLength - 1;
  if (!hasPrev && !hasNext) return;

  const btnH = Math.ceil(navFontSize * 2.5);
  const shared = {
    y: startY,
    h: btnH,
    text_size: navFontSize,
    radius: PADDING,
    normal_color: bgColor,
    press_color: pressColor,
  };

  if (hasPrev && hasNext) {
    const btnW = Math.floor((LAYOUT.W - PADDING * 3) / 2);
    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...shared,
      x: PADDING,
      w: btnW,
      text: "← Anterior",
      click_func: () => replace(buildChapterRoute(bookIndex, chapterIndex - 1)),
    });
    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...shared,
      x: PADDING * 2 + btnW,
      w: btnW,
      text: "Próximo →",
      click_func: () => replace(buildChapterRoute(bookIndex, chapterIndex + 1)),
    });
  } else if (hasPrev) {
    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...shared,
      x: PADDING,
      w: LAYOUT.W - PADDING * 2,
      text: "← Capítulo anterior",
      click_func: () => replace(buildChapterRoute(bookIndex, chapterIndex - 1)),
    });
  } else {
    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...shared,
      x: PADDING,
      w: LAYOUT.W - PADDING * 2,
      text: "Próximo capítulo →",
      click_func: () => replace(buildChapterRoute(bookIndex, chapterIndex + 1)),
    });
  }
}

const BATCH_SIZE = 3;
const BATCH_INTERVAL = 500;

function buildContent(verses, bookIndex, chapterIndex, style) {
  const margin = style.margin;
  const text_width = LAYOUT.W - margin * 2;
  const fontProp = style.font ? { font: style.font } : {};
  const stack = vstack(LAYOUT.headerH + PADDING, PADDING);
  const text_size = style.fontSize;

  let currentIndex = 0;

  function renderVerse() {
    if (currentIndex >= verses.length) return;
    const verse = verses[currentIndex];
    const { height } = hmUI.getTextLayout(verse, { text_size, text_width });

    const y = stack.add(height + PADDING);

    hmUI.createWidget(hmUI.widget.TEXT, {
      y,
      x: margin,
      w: text_width,
      h: height,
      text_size,
      text: verse,
      color: style.color,
      text_style: hmUI.text_style.WRAP,
      align_v: hmUI.align.TOP,
      ...fontProp,
    });

    currentIndex++;
  }

  // Primeiros 5 imediatamente
  for (let i = 0; i < BATCH_SIZE; i++) renderVerse();

  // A cada 1s, renderiza mais 5
  const interval = setInterval(() => {
    if (currentIndex < verses.length) {
      for (let i = 0; i < BATCH_SIZE; i++) renderVerse();
    } else {
      clearInterval(interval);
      const navY = stack.y + PADDING * 2;
      buildNavButtons(chapterIndex, BOOKS[bookIndex].chapters, bookIndex, navY);
      const navBtnH = Math.ceil(navFontSize * 2.5);
      hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: 0, y: navY + navBtnH, w: LAYOUT.W, h: LAYOUT.pad * 2, color: bgColor,
      });
      return;
    }
  }, BATCH_INTERVAL);
}

Page(
  BasePage({
    state: {
      bookIndex: 0,
      chapterIndex: 0,
    },

    onInit(params) {
      const p = typeof params === "string" ? JSON.parse(params || "{}") : (params ?? {});
      this.state.bookIndex = p.bookIndex || 0;
      this.state.chapterIndex = p.chapterIndex || 0;
      saveBookmark(this.state.bookIndex, this.state.chapterIndex);
      markChapterRead(this.state.bookIndex, this.state.chapterIndex);
    },

    build() {
      hmUI.setStatusBarVisible(false);
      const { bookIndex, chapterIndex } = this.state;

      const cfg = loadSettings();
      const style = {
        fontSize: FONT_SIZES[cfg.fontSizeIndex],
        color: TEXT_COLORS[cfg.colorIndex],
        font: FONTS[cfg.fontIndex],
        margin: MARGINS[cfg.marginIndex],
      };
      const verses = readChapter(bookIndex, chapterIndex);

      buildHeader(BOOKS[bookIndex].name, chapterIndex);

      buildContent(verses, bookIndex, chapterIndex, style);
    },
  }),
);
