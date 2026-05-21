import * as hmUI from "@zos/ui";
import { back } from "@zos/router";
import { BasePage } from "@zeppos/zml/base-page";
import { BOOKS } from "../../utils/bible-meta";
import { LAYOUT } from "zosLoader:./index.[pf].layout.js";
import { PADDING } from "../../utils/vstack";
import { COMMON_LAYOUT } from "../../utils/config/layout";
import { markAllRead, markAllUnread, clearAllProgress } from "../../utils/progress";

const { bgColor, pressColor, color, textSize, radius } = COMMON_LAYOUT;
const READ_COLOR = 0x1b5e20;
const DANGER_COLOR = 0x7b1010;
const w = (layout) => layout.W - layout.pad * 2;

Page(
  BasePage({
    state: { bookIndex: 0, btns: [] },

    onInit(params) {
      const p = JSON.parse(params || "{}");
      this.state.bookIndex = p.bookIndex || 0;
    },

    build() {
      const book = BOOKS[this.state.bookIndex];

      hmUI.createWidget(hmUI.widget.TEXT, {
        x: LAYOUT.pad,
        y: LAYOUT.statusBarH,
        w: LAYOUT.W - LAYOUT.pad * 2,
        h: LAYOUT.headerH,
        text: book.name,
        color,
        text_size: hmUI.sp(22),
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
      });

      this._buildMain();
    },

    _buildMain() {
      this._clearBtns();
      const bookIndex = this.state.bookIndex;
      const book = BOOKS[bookIndex];
      const bw = w(LAYOUT);
      let y = LAYOUT.statusBarH + LAYOUT.headerH + LAYOUT.pad;

      this.state.btns = [
        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: LAYOUT.pad, y, w: bw, h: LAYOUT.btnH,
          text: "Marcar todos como lidos",
          text_size: textSize, color,
          normal_color: READ_COLOR, press_color: pressColor, radius,
          click_func: () => { markAllRead(bookIndex, book.chapters); back(); },
        }),
        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: LAYOUT.pad, y: y + LAYOUT.btnH + LAYOUT.pad, w: bw, h: LAYOUT.btnH,
          text: "Marcar todos como não lidos",
          text_size: textSize, color,
          normal_color: bgColor, press_color: pressColor, radius,
          click_func: () => { markAllUnread(bookIndex); back(); },
        }),
        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: LAYOUT.pad, y: y + (LAYOUT.btnH + LAYOUT.pad) * 2, w: bw, h: LAYOUT.btnH,
          text: "Limpar todos os dados",
          text_size: textSize, color,
          normal_color: DANGER_COLOR, press_color: pressColor, radius,
          click_func: () => this._buildConfirm(),
        }),
        hmUI.createWidget(hmUI.widget.FILL_RECT, {
          x: 0, y: y + (LAYOUT.btnH + LAYOUT.pad) * 2 + LAYOUT.btnH, w: LAYOUT.W, h: LAYOUT.pad * 2, color: bgColor,
        }),
      ];
    },

    _buildConfirm() {
      this._clearBtns();
      const bw = w(LAYOUT);
      let y = LAYOUT.statusBarH + LAYOUT.headerH + LAYOUT.pad;

      hmUI.createWidget(hmUI.widget.TEXT, {
        x: LAYOUT.pad,
        y,
        w: bw,
        h: LAYOUT.btnH,
        text: "Apagar todo o progresso?",
        color,
        text_size: textSize,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
      });
      y += LAYOUT.btnH + LAYOUT.pad;

      const halfW = Math.floor((bw - PADDING) / 2);
      this.state.btns = [
        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: LAYOUT.pad, y, w: halfW, h: LAYOUT.btnH,
          text: "Sim",
          text_size: textSize, color,
          normal_color: DANGER_COLOR, press_color: pressColor, radius,
          click_func: () => { clearAllProgress(); back(); },
        }),
        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: LAYOUT.pad + halfW + PADDING, y, w: halfW, h: LAYOUT.btnH,
          text: "Não",
          text_size: textSize, color,
          normal_color: bgColor, press_color: pressColor, radius,
          click_func: () => this._buildMain(),
        }),
        hmUI.createWidget(hmUI.widget.FILL_RECT, {
          x: 0, y: y + LAYOUT.btnH, w: LAYOUT.W, h: LAYOUT.pad * 2, color: bgColor,
        }),
      ];
    },

    _clearBtns() {
      this.state.btns.forEach((btn) => hmUI.deleteWidget(btn));
      this.state.btns = [];
    },
  }),
);
