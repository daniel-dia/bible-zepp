import * as hmUI from "@zos/ui";
import { push } from "@zos/router";
import { BasePage } from "@zeppos/zml/base-page";
import { BOOKS } from "../../utils/bible-meta";
import { LAYOUT } from "zosLoader:./index.[pf].layout.js";
import { PADDING } from "../../utils/vstack";
import { COMMON_LAYOUT } from "../../utils/config/layout";

const { bgColor, pressColor, color } = COMMON_LAYOUT;

Page(
  BasePage({
    state: { bookIndex: 0 },

    onInit(params) {
      const parsed = JSON.parse(params);
      this.state.bookIndex = parsed.bookIndex || 0;
    },

    build() {
      const bookIndex = this.state.bookIndex;
      const book = BOOKS[bookIndex];

      // Header
      const headerY = LAYOUT.statusBarH + PADDING;
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: LAYOUT.pad,
        y: headerY,
        w: LAYOUT.W - LAYOUT.pad * 2,
        h: LAYOUT.headerH,
        text: book.name,
        color,
        text_size: hmUI.sp(26),
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
      });

      // Chapter grid: 5 columns, rows separated by PADDING
      const cols = LAYOUT.cols;
      const btnW = Math.floor(LAYOUT.W / cols);
      const gridStartY = headerY + LAYOUT.headerH + PADDING;

      for (let i = 0; i < book.chapters; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const idx = i;

        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: col * btnW + PADDING,
          y: gridStartY + row * (LAYOUT.btnH + PADDING),
          w: btnW - PADDING * 2,
          h: LAYOUT.btnH,
          text: `${i + 1}`,
          normal_color: bgColor,
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
      }

      hmUI.createWidget(hmUI.widget.PAGE_SCROLLBAR);
    },
  }),
);
