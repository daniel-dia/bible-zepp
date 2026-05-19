import * as hmUI from "@zos/ui";
import { push } from "@zos/router";
import { BasePage } from "@zeppos/zml/base-page";
import { BOOKS, NT_START } from "../../utils/bible-meta";
import { LAYOUT } from "zosLoader:./index.[pf].layout.js";
import { DEVICE_HEIGHT } from "../../utils/config/device";
import { COMMON_LAYOUT, getListItemLayout } from "../../utils/config/layout";

const OT = BOOKS.slice(0, NT_START);
const NT = BOOKS.slice(NT_START);

const { radius, bgColor, pressColor, textSize } = COMMON_LAYOUT;
const { w, h } = getListItemLayout(LAYOUT);

function getDataArray(isAT) {
  return (isAT ? OT : NT).map((book) => ({ name: book.name }));
}

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

function buildListItemConfig() {
  return {
    type_id: 1,
    item_height: h,
    item_bg_radius: radius,
    text_view: [
      {
        key: "name",
        y: 0,
        x: LAYOUT.pad,
        w,
        h: COMMON_LAYOUT.textSize,
        text_size: textSize,
        align_h: hmUI.align.LEFT,
        align_v: hmUI.align.CENTER_V,
      },
    ],
    text_view_count: 1,
  };
}

function buildBookList(dataArray, onItemClick) {
  const listY = LAYOUT.statusBarH + h + LAYOUT.pad;

  return hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
    x: 0,
    y: listY,
    w: LAYOUT.W,
    h: DEVICE_HEIGHT - listY,
    item_space: LAYOUT.pad,
    enable_scroll_bar: true,
    item_config: [buildListItemConfig()],
    item_config_count: 1,
    data_array: dataArray,
    data_count: dataArray.length,
    item_click_func: onItemClick,
  });
}

Page(
  BasePage({
    state: {
      testament: "AT",
    },

    build() {
      buildTestamentTabs((t) => this.selectTestament(t));

      const dataArray = getDataArray(true);
      this.scrollList = buildBookList(dataArray, (list, index) => {
        const offset = this.state.testament === "AT" ? 0 : NT_START;
        push({
          url: "page/chapters/index",
          params: JSON.stringify({ bookIndex: offset + index }),
        });
      });
    },

    selectTestament(testament) {
      if (this.state.testament === testament) return;
      this.state.testament = testament;
      const dataArray = getDataArray(testament === "AT");
      this.scrollList.setProperty(hmUI.prop.UPDATE_DATA, {
        data_array: dataArray,
        data_count: dataArray.length,
        on_page: 0,
      });
    },
  }),
);
