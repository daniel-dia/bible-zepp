import * as hmUI from "@zos/ui";
import { push } from "@zos/router";
import { BasePage } from "@zeppos/zml/base-page";
import { BOOKS, NT_START } from "../../utils/bible-meta";
import { LAYOUT } from "zosLoader:./index.[pf].layout.js";
import { DEVICE_HEIGHT } from "../../utils/config/device";
import { COMMON_LAYOUT, getListItemLayout } from "../../utils/config/layout";
import { loadBookmark } from "../../utils/bookmark";
import { getBookProgress } from "../../utils/progress";

const OT = BOOKS.slice(0, NT_START);
const NT = BOOKS.slice(NT_START);

const { radius, bgColor, pressColor, textSize, color } = COMMON_LAYOUT;
const { w, h } = getListItemLayout(LAYOUT);

function buildTestamentTabs(onSelect, tabsY) {
  const halfW = Math.floor(LAYOUT.W / 2 - LAYOUT.pad);
  const tabProps = { text_size: textSize, y: tabsY, h, normal_color: bgColor, press_color: pressColor, radius };

  hmUI.createWidget(hmUI.widget.BUTTON, {
    ...tabProps,
    text: "A. Testamento",
    x: LAYOUT.pad,
    w: halfW,
    click_func: () => onSelect("AT"),
  });

  hmUI.createWidget(hmUI.widget.BUTTON, {
    ...tabProps,
    text: "N. Testamento",
    x: halfW + LAYOUT.pad,
    w: LAYOUT.W - halfW - LAYOUT.pad * 2,
    click_func: () => onSelect("NT"),
  });
}

function buildBookList(books, onBookClick, listY, bookIndexOffset) {
  const itemStep = h + LAYOUT.pad;
  const xOffset = Math.floor((LAYOUT.W - w) / 2);

  const container = hmUI.createWidget(hmUI.widget.VIEW_CONTAINER, {
    x: 0,
    y: listY,
    w: LAYOUT.W,
    h: DEVICE_HEIGHT - listY,
    scroll_enable: 1,
  });

  books.forEach((book, i) => {
    const globalIndex = bookIndexOffset + i;
    const { percent } = getBookProgress(globalIndex, book.chapters);
    const label = percent > 0 ? `${book.name}  ${percent}%` : book.name;
    container.createWidget(hmUI.widget.BUTTON, {
      x: xOffset,
      y: i * itemStep,
      w,
      h,
      text: label,
      text_size: textSize,
      color,
      normal_color: bgColor,
      press_color: pressColor,
      radius,
      click_func: () => onBookClick(i),
    });
  });

  const scrollBar = hmUI.createWidget(hmUI.widget.PAGE_SCROLLBAR, { target: container });

  return { container, scrollBar };
}

Page(
  BasePage({
    state: {
      testament: "AT",
    },

    build() {
      const bookmark = loadBookmark();
      const bookmarkOffset = bookmark ? h + LAYOUT.pad : 0;
      const tabsY = LAYOUT.statusBarH + bookmarkOffset;
      this.listStartY = tabsY + h + LAYOUT.pad;

      if (bookmark) {
        const book = BOOKS[bookmark.bookIndex];
        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: Math.floor((LAYOUT.W - w) / 2),
          y: LAYOUT.statusBarH,
          w,
          h,
          text: `▶ ${book.name} ${bookmark.chapterIndex + 1}`,
          text_size: textSize,
          color,
          normal_color: bgColor,
          press_color: pressColor,
          radius,
          click_func: () =>
            push({
              url: "page/reading/index",
              params: JSON.stringify({ bookIndex: bookmark.bookIndex, chapterIndex: bookmark.chapterIndex }),
            }),
        });
      }

      buildTestamentTabs((t) => this.selectTestament(t), tabsY);
      const list = buildBookList(OT, (i) => {
        push({
          url: "page/chapters/index",
          params: JSON.stringify({ bookIndex: i }),
        });
      }, this.listStartY, 0);
      this.container = list.container;
      this.scrollBar = list.scrollBar;
    },

    selectTestament(testament) {
      if (this.state.testament === testament) return;
      this.state.testament = testament;
      hmUI.deleteWidget(this.container);
      hmUI.deleteWidget(this.scrollBar);
      const books = testament === "AT" ? OT : NT;
      const offset = testament === "AT" ? 0 : NT_START;
      const list = buildBookList(books, (i) => {
        push({
          url: "page/chapters/index",
          params: JSON.stringify({ bookIndex: offset + i }),
        });
      }, this.listStartY, offset);
      this.container = list.container;
      this.scrollBar = list.scrollBar;
    },
  }),
);
