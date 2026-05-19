import { px } from "@zos/utils";

export const PADDING = px(8);

export function vstack(startY, gap = PADDING) {
  let y = startY;
  return {
    add(height) {
      const itemY = y;
      y += height + gap;
      return itemY;
    },
    get y() {
      return y;
    },
  };
}
