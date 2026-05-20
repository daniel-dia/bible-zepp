import { px } from "@zos/utils";
import { localStorage } from "@zos/storage";

const KEY = "reading_settings";

export const FONT_SIZES = [px(20), px(24), px(28), px(32)];
export const FONT_SIZE_LABELS = ["P", "N", "G", "X"];

export const TEXT_COLORS = [0xffffff, 0xfff8e7, 0xffeb3b, 0xb3e5fc];
export const TEXT_COLOR_LABELS = ["Branco", "Creme", "Amarelo", "Azul"];

export const FONTS = [null, "fonts/Nunito-Light.ttf"];
export const FONT_LABELS = ["Normal", "Light"];

const DEFAULTS = { fontSizeIndex: 1, colorIndex: 0, fontIndex: 1 };

export function loadSettings() {
  return { ...DEFAULTS, ...(localStorage.getItem(KEY) || {}) };
}

export function saveSettings(settings) {
  localStorage.setItem(KEY, settings);
}
