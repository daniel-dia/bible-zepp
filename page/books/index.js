import * as hmUI from "@zos/ui";
import { push } from "@zos/router";
import { BasePage } from "@zeppos/zml/base-page";
import { BOOKS, NT_START } from "../../utils/bible-meta";
import { LAYOUT } from "zosLoader:./index.[pf].layout.js";
import { DEVICE_HEIGHT } from "../../utils/config/device";
import { COMMON_LAYOUT, getListItemLayout } from "../../utils/config/layout";

const OT = BOOKS.slice(0, NT_START);
const NT = BOOKS.slice(NT_START);

const { radius, bgColor, pressColor, textSize, color } = COMMON_LAYOUT;
const { w, h } = getListItemLayout(LAYOUT);

function buildTestamentTabs(onSelect) {
  const halfW = Math.floor(LAYOUT.W / 2);
  const tabProps = { text_size: textSize, y: LAYOUT.statusBarH, h, normal_color: bgColor, press_color: pressColor, radius };

  hmUI.createWidget(hmUI.widget.BUTTON, {
    ...tabProps,
    text: "A. Testamento",
    x: 0,
    w: halfW,
    click_func: () => onSelect("AT"),
  });

  hmUI.createWidget(hmUI.widget.BUTTON, {
    ...tabProps,
    text: "N. Testamento",
    x: halfW,
    w: LAYOUT.W - halfW,
    click_func: () => onSelect("NT"),
  });
}

function buildBookList(books, onBookClick) {
  const listY = LAYOUT.statusBarH + h + LAYOUT.pad;
  const itemStep = h + LAYOUT.pad;
  const xOffset = Math.floor((LAYOUT.W - w) / 2);

  const container = hmUI.createWidget(hmUI.widget.VIEW_CONTAINER, {
    x: 0,
    y: listY,
    w: LAYOUT.W,
    h: DEVICE_HEIGHT - listY,
    scroll_enable: 1,
  });

  books.forEach((book, i) => {
    container.createWidget(hmUI.widget.BUTTON, {
      x: 0,
      y: i * itemStep,
      w: LAYOUT.W,
      h,
      text: book.name,
      text_size: textSize,
      color,
      normal_color: bgColor,
      press_color: pressColor,
      radius,
      click_func: () => onBookClick(i),
    });
  });

  return container;
}

Page(
  BasePage({
    state: {
      testament: "AT",
    },

    build() {
      buildTestamentTabs((t) => this.selectTestament(t));
      this.container = buildBookList(OT, (i) => {
        push({
          url: "page/chapters/index",
          params: JSON.stringify({ bookIndex: i }),
        });
      });
    },

    selectTestament(testament) {
      if (this.state.testament === testament) return;
      this.state.testament = testament;
      hmUI.deleteWidget(this.container);
      const books = testament === "AT" ? OT : NT;
      const offset = testament === "AT" ? 0 : NT_START;
      this.container = buildBookList(books, (i) => {
        push({
          url: "page/chapters/index",
          params: JSON.stringify({ bookIndex: offset + i }),
        });
      });
    },
  }),
);
