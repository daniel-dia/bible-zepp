import { px } from "@zos/utils";

export const COMMON_LAYOUT = {
  radius: px(28),
  bgColor: 0x333333,
  pressColor: 0x999999,
  color: 0xffffff,
  textSize: px(24),
  verseFontSize: px(24),
  navFontSize: px(24),
};

export function getListItemLayout(layout) {
  return {
    w: layout.W - layout.pad * 2,
    h: COMMON_LAYOUT.textSize + 2 * layout.pad,
  };
}
