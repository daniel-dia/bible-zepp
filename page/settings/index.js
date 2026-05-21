import * as hmUI from "@zos/ui";
import { BasePage } from "@zeppos/zml/base-page";
import { LAYOUT } from "zosLoader:./index.[pf].layout.js";
import { PADDING } from "../../utils/vstack";
import { COMMON_LAYOUT } from "../../utils/config/layout";
import {
  FONT_SIZES,
  FONT_SIZE_LABELS,
  TEXT_COLORS,
  TEXT_COLOR_LABELS,
  FONTS,
  FONT_LABELS,
  MARGINS,
  MARGIN_LABELS,
  loadSettings,
  saveSettings,
} from "../../utils/settings";

const { bgColor, pressColor } = COMMON_LAYOUT;
const SELECTED_COLOR = 0x1565c0;
const WHITE = 0xffffff;

function optW4(layout) {
  return Math.floor((layout.W - layout.pad * 2 - PADDING * 3) / 4);
}

function optW2(layout) {
  return Math.floor((layout.W - layout.pad * 2 - PADDING) / 2);
}

function optW3(layout) {
  return Math.floor((layout.W - layout.pad * 2 - PADDING * 2) / 3);
}

Page(
  BasePage({
    state: {
      settings: null,
      sizeBtns: [],
      colorBtns: [],
      fontBtns: [],
      marginBtns: [],
      sizeY: 0,
      colorY: 0,
      fontY: 0,
      marginY: 0,
    },

    build() {
      this.state.settings = loadSettings();

      hmUI.createWidget(hmUI.widget.TEXT, {
        x: LAYOUT.pad,
        y: LAYOUT.statusBarH,
        w: LAYOUT.W - LAYOUT.pad * 2,
        h: LAYOUT.headerH,
        text: "Configurações",
        color: WHITE,
        text_size: hmUI.sp(22),
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
      });

      let y = LAYOUT.statusBarH + LAYOUT.headerH + LAYOUT.pad;

      this.state.sizeY = y;
      this.state.sizeBtns = this._buildSizeBtns(y, this.state.settings.fontSizeIndex);
      y += LAYOUT.optBtnH + LAYOUT.pad * 2;

      this.state.colorY = y;
      this.state.colorBtns = this._buildColorBtns(y, this.state.settings.colorIndex);
      y += 2 * (LAYOUT.optBtnH + PADDING) + LAYOUT.pad;

      this.state.fontY = y;
      this.state.fontBtns = this._buildFontBtns(y, this.state.settings.fontIndex);
      y += LAYOUT.optBtnH + LAYOUT.pad * 2;

      this.state.marginY = y;
      this.state.marginBtns = this._buildMarginBtns(y, this.state.settings.marginIndex);

      hmUI.createWidget(hmUI.widget.PAGE_SCROLLBAR);
    },

    _buildSizeBtns(y, selected) {
      const w = optW4(LAYOUT);
      return FONT_SIZE_LABELS.map((label, i) =>
        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: LAYOUT.pad + i * (w + PADDING),
          y,
          w,
          h: LAYOUT.optBtnH,
          text: label,
          text_size: hmUI.sp(20),
          color: WHITE,
          normal_color: selected === i ? SELECTED_COLOR : bgColor,
          press_color: pressColor,
          radius: PADDING,
          click_func: () => this._setSizeIndex(i),
        }),
      );
    },

    _buildColorBtns(y, selected) {
      const w = optW2(LAYOUT);
      return TEXT_COLOR_LABELS.map((label, i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        return hmUI.createWidget(hmUI.widget.BUTTON, {
          x: LAYOUT.pad + col * (w + PADDING),
          y: y + row * (LAYOUT.optBtnH + PADDING),
          w,
          h: LAYOUT.optBtnH,
          text: label,
          text_size: hmUI.sp(18),
          color: selected === i ? WHITE : TEXT_COLORS[i],
          normal_color: selected === i ? SELECTED_COLOR : bgColor,
          press_color: pressColor,
          radius: PADDING,
          click_func: () => this._setColorIndex(i),
        });
      });
    },

    _buildFontBtns(y, selected) {
      const w = optW2(LAYOUT);
      return FONT_LABELS.map((label, i) => {
        const fontProp = FONTS[i] ? { font: FONTS[i] } : {};
        return hmUI.createWidget(hmUI.widget.BUTTON, {
          x: LAYOUT.pad + i * (w + PADDING),
          y,
          w,
          h: LAYOUT.optBtnH,
          text: label,
          text_size: hmUI.sp(20),
          color: WHITE,
          normal_color: selected === i ? SELECTED_COLOR : bgColor,
          press_color: pressColor,
          radius: PADDING,
          ...fontProp,
          click_func: () => this._setFontIndex(i),
        });
      });
    },

    _setSizeIndex(i) {
      this.state.settings.fontSizeIndex = i;
      saveSettings(this.state.settings);
      this.state.sizeBtns.forEach((btn) => hmUI.deleteWidget(btn));
      this.state.sizeBtns = this._buildSizeBtns(this.state.sizeY, i);
    },

    _setColorIndex(i) {
      this.state.settings.colorIndex = i;
      saveSettings(this.state.settings);
      this.state.colorBtns.forEach((btn) => hmUI.deleteWidget(btn));
      this.state.colorBtns = this._buildColorBtns(this.state.colorY, i);
    },

    _setFontIndex(i) {
      this.state.settings.fontIndex = i;
      saveSettings(this.state.settings);
      this.state.fontBtns.forEach((btn) => hmUI.deleteWidget(btn));
      this.state.fontBtns = this._buildFontBtns(this.state.fontY, i);
    },

    _buildMarginBtns(y, selected) {
      const w = optW3(LAYOUT);
      return MARGIN_LABELS.map((label, i) =>
        hmUI.createWidget(hmUI.widget.BUTTON, {
          x: LAYOUT.pad + i * (w + PADDING),
          y,
          w,
          h: LAYOUT.optBtnH,
          text: label,
          text_size: hmUI.sp(20),
          color: WHITE,
          normal_color: selected === i ? SELECTED_COLOR : bgColor,
          press_color: pressColor,
          radius: PADDING,
          click_func: () => this._setMarginIndex(i),
        }),
      );
    },

    _setMarginIndex(i) {
      this.state.settings.marginIndex = i;
      saveSettings(this.state.settings);
      this.state.marginBtns.forEach((btn) => hmUI.deleteWidget(btn));
      this.state.marginBtns = this._buildMarginBtns(this.state.marginY, i);
    },
  }),
);
