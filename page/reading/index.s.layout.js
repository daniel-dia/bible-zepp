import { px } from "@zos/utils";
import { DEVICE_WIDTH } from "../../utils/config/device";

export const LAYOUT = {
  W: DEVICE_WIDTH,
  headerH: px(60),
  pad: px(12),
  verseNumW: px(30),
  // Approx chars per line at 23px font on ~390px width after padding
  charsPerLine: 22,
  lineH: px(32),
};
