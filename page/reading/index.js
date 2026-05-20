import * as hmUI from "@zos/ui";
import { replace } from "@zos/router";
import { BasePage } from "@zeppos/zml/base-page";
import { BOOKS } from "../../utils/bible-meta";
import { readChapter } from "../../utils/fs-helper";
import { saveBookmark } from "../../utils/bookmark";
import { markChapterRead } from "../../utils/progress";
import { LAYOUT } from "zosLoader:./index.[pf].layout.js";
import { vstack, PADDING } from "../../utils/vstack";
import { COMMON_LAYOUT } from "../../utils/config/layout";
import { px } from "@zos/utils";

const { bgColor, pressColor, color, verseFontSize, navFontSize } = COMMON_LAYOUT;

function buildChapterRoute(bookIndex, chapterIndex) {
  return {
    url: "page/reading/index",
    params: JSON.stringify({ bookIndex, chapterIndex }),
  };
}

function buildHeader(bookName, chapterIndex) {
  hmUI.createWidget(hmUI.widget.TEXT, {
    x: 0,
    y: 0,
    w: LAYOUT.W,
    h: LAYOUT.headerH,
    text: `${bookName} ${chapterIndex + 1}`,
    text_size: hmUI.sp(26),
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.CENTER_V,
  });
}

function buildLoading() {
  return hmUI.createWidget(hmUI.widget.TEXT, {
    x: 0,
    y: LAYOUT.headerH,
    w: LAYOUT.W,
    h: PADDING * 6,
    text: "Carregando...",
    color,
    text_size: verseFontSize,
    font: 'fonts/Nunito-Light.ttf',
    align_h: hmUI.align.CENTER_H,
    align_v: hmUI.align.CENTER_V,
  });
}

function buildError() {
  hmUI.createWidget(hmUI.widget.TEXT, {
    x: PADDING,
    y: LAYOUT.headerH + PADDING,
    w: LAYOUT.W - PADDING * 2,
    h: PADDING * 5,
    text: "Erro ao carregar o capítulo.",
    color,
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

function buildContent(verses, bookIndex, chapterIndex) {
  const textW = LAYOUT.W - LAYOUT.pad * 2;
  const stack = vstack(LAYOUT.headerH + PADDING, PADDING);

  verses.forEach((verse) => {
    const label = verse;
    const { height } = hmUI.getTextLayout(label, {
      text_size: verseFontSize,
      text_width: textW,
    });
    const y = stack.add(height + PADDING );
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: LAYOUT.pad,
      y,
      w: textW,
      h: height,
      text: label,
      color,
      text_size: verseFontSize,
      font: 'fonts/Nunito-Light.ttf',
      text_style: hmUI.text_style.WRAP,
      align_v: hmUI.align.TOP,
    });
  });

  buildNavButtons(chapterIndex, BOOKS[bookIndex].chapters, bookIndex, stack.y + PADDING * 2);
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

      buildHeader(BOOKS[bookIndex].name, chapterIndex);
      const loading = buildLoading();

      setTimeout(() => {
        hmUI.deleteWidget(loading);

        const verses = readChapter(bookIndex, chapterIndex);
        if (!verses) {
          buildError();
          return;
        }

        buildContent(verses, bookIndex, chapterIndex);
      }, 50);
    },
  }),
);
