import { px } from "@zos/utils";
import { DEVICE_WIDTH } from "../../utils/config/device";

export const LAYOUT = {
  W: DEVICE_WIDTH,
  headerH: px(70),
  pad: px(44),
  verseNumW: px(32),
  // Approx chars per line at 23px font on ~480px width minus round padding
  charsPerLine: 24,
  lineH: px(34),
};
