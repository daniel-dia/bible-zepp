import * as hmUI from "@zos/ui";
import { push } from "@zos/router";
import { BasePage } from "@zeppos/zml/base-page";
import { BOOKS } from "../../utils/bible-meta";
import { LAYOUT } from "zosLoader:./index.[pf].layout.js";
import { PADDING } from "../../utils/vstack";
import { COMMON_LAYOUT } from "../../utils/config/layout";
import { isChapterRead } from "../../utils/progress";

const { bgColor, pressColor, color } = COMMON_LAYOUT;
const READ_COLOR = 0x1b5e20;
const ICON_W = LAYOUT.btnH;

Page(
  BasePage({
    state: { bookIndex: 0 },

    onInit(params) {
      const parsed = JSON.parse(params);
      this.state.bookIndex = parsed.bookIndex || 0;
    },

    build() {
      this._buildPage();
    },

    onResume() {
      this._refreshChapterColors();
    },

    _buildPage() {
      const bookIndex = this.state.bookIndex;
      const book = BOOKS[bookIndex];

      const headerY = LAYOUT.statusBarH + PADDING;

      hmUI.createWidget(hmUI.widget.TEXT, {
        x: LAYOUT.pad,
        y: headerY,
        w: LAYOUT.W - LAYOUT.pad - ICON_W - PADDING,
        h: LAYOUT.headerH,
        text: book.name,
        color,
        text_size: hmUI.sp(26),
        align_h: hmUI.align.LEFT,
        align_v: hmUI.align.CENTER_V,
      });

      hmUI.createWidget(hmUI.widget.BUTTON, {
        x: LAYOUT.W - ICON_W,
        y: headerY,
        w: ICON_W,
        h: LAYOUT.headerH,
        text: "⚙",
        text_size: hmUI.sp(22),
        color,
        normal_color: bgColor,
        press_color: pressColor,
        radius: PADDING,
        click_func: () =>
          push({
            url: "page/options/index",
            params: JSON.stringify({ bookIndex }),
          }),
      });

      // Chapter grid
      const cols = LAYOUT.cols;
      const btnW = Math.floor(LAYOUT.W / cols);
      const gridStartY = headerY + LAYOUT.headerH + PADDING;

      this.chapterBtns = [];
      for (let i = 0; i < book.chapters; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const idx = i;
        const isRead = isChapterRead(bookIndex, idx);

        const btn = hmUI.createWidget(hmUI.widget.BUTTON, {
          x: col * btnW + PADDING,
          y: gridStartY + row * (LAYOUT.btnH + PADDING),
          w: btnW - PADDING * 2,
          h: LAYOUT.btnH,
          text: `${i + 1}`,
          normal_color: isRead ? READ_COLOR : bgColor,
          press_color: pressColor,
          text_size: hmUI.sp(22),
          radius: PADDING,
          click_func: () => {
            push({
              url: "page/reading/index",
              params: JSON.stringify({ bookIndex, chapterIndex: idx }),
            });
          },
        });
        this.chapterBtns.push(btn);
      }

      hmUI.createWidget(hmUI.widget.PAGE_SCROLLBAR);
    },

    _refreshChapterColors() {
      if (!this.chapterBtns) return;
      const bookIndex = this.state.bookIndex;
      this.chapterBtns.forEach((btn, i) => {
        const isRead = isChapterRead(bookIndex, i);
        btn.setProperty(hmUI.prop.MORE, { normal_color: isRead ? READ_COLOR : bgColor });
      });
    },
  }),
);
