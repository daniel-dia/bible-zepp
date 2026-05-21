import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";
import { push } from "@zos/router";
import { BasePage } from "@zeppos/zml/base-page";
import { BOOKS, NT_START } from "../../utils/bible-meta";
import { LAYOUT } from "zosLoader:./index.[pf].layout.js";
import { COMMON_LAYOUT, getListItemLayout } from "../../utils/config/layout";
import { PADDING } from "../../utils/vstack";
import { loadBookmark } from "../../utils/bookmark";
import { getBookProgress } from "../../utils/progress";

const OT = BOOKS.slice(0, NT_START);
const NT = BOOKS.slice(NT_START);

const { radius, bgColor, pressColor, textSize, color } = COMMON_LAYOUT;
const { w, h } = getListItemLayout(LAYOUT);

function buildTestamentTabs(onSelect, tabsY) {
  const tabW = Math.floor((LAYOUT.W - LAYOUT.pad * 2 - PADDING) / 2);
  const tabProps = { text_size: textSize, y: tabsY, h, normal_color: bgColor, press_color: pressColor, radius };

  hmUI.createWidget(hmUI.widget.BUTTON, {
    ...tabProps,
    text: "A.T.",
    x: LAYOUT.pad,
    w: tabW,
    click_func: () => onSelect("AT"),
  });

  hmUI.createWidget(hmUI.widget.BUTTON, {
    ...tabProps,
    text: "N.T.",
    x: LAYOUT.pad + tabW + PADDING,
    w: tabW,
    click_func: () => onSelect("NT"),
  });
}

function buildBookButtons(books, onBookClick, startY, bookIndexOffset) {
  const itemStep = h + LAYOUT.pad;
  const xOffset = Math.floor((LAYOUT.W - w) / 2);

  const btns = books.map((book, i) => {
    const globalIndex = bookIndexOffset + i;
    const { percent } = getBookProgress(globalIndex, book.chapters);
    const label = percent === 100 ? `${book.name}  ✓` : book.name;
    return hmUI.createWidget(hmUI.widget.BUTTON, {
      x: xOffset,
      y: startY + i * itemStep,
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

  btns.push(hmUI.createWidget(hmUI.widget.FILL_RECT, {
    x: 0,
    y: startY + books.length * itemStep,
    w: LAYOUT.W,
    h: LAYOUT.pad * 2,
    color: bgColor,
  }));

  return btns;
}

Page(
  BasePage({
    state: { testament: "AT" },

    build() {
      const bookmark = loadBookmark();
      const bookmarkOffset = bookmark ? h + LAYOUT.pad : 0;
      const tabsY = LAYOUT.statusBarH + bookmarkOffset;
      this.listStartY = tabsY + h + LAYOUT.pad;

      if (bookmark) {
        const book = BOOKS[bookmark.bookIndex];
        const btnX = Math.floor((LAYOUT.W - w) / 2);
        const btnY = LAYOUT.statusBarH;

        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: btnX,
          y: btnY,
          w,
          h,
          text: `Continuar ${book.name} ${bookmark.chapterIndex + 1}`,
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

        const imgW = px(26);
        const imgH = px(38);
        hmUI.createWidget(hmUI.widget.IMG, {
          x: Math.floor(LAYOUT.W * 0.8),
          y: btnY - px(6),
          w: imgW,
          h: imgH,
          src: "bookmark.png",
        });
      }

      buildTestamentTabs((t) => this.selectTestament(t), tabsY);

      this.bookBtns = buildBookButtons(OT, (i) => push({ url: "page/chapters/index", params: JSON.stringify({ bookIndex: i }) }), this.listStartY, 0);

      hmUI.createWidget(hmUI.widget.PAGE_SCROLLBAR);
    },

    selectTestament(testament) {
      if (this.state.testament === testament) return;
      this.state.testament = testament;
      this.bookBtns.forEach((btn) => hmUI.deleteWidget(btn));
      const books = testament === "AT" ? OT : NT;
      const offset = testament === "AT" ? 0 : NT_START;
      this.bookBtns = buildBookButtons(books, (i) => push({ url: "page/chapters/index", params: JSON.stringify({ bookIndex: offset + i }) }), this.listStartY, offset);
    },
  }),
);
