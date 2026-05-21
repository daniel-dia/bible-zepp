# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

NVI Bible reader app for Zepp OS smartwatches. Pure JavaScript (no TypeScript, no bundler).

## Commands

```bash
npm run dev      # zeus dev — start dev server
npm run build    # zeus build — production build
npm run preview  # zeus preview — simulator
npm run bridge   # zeus bridge — connect to physical device
npm run format   # prettier --write .
```

No automated tests — validate with `zeus preview` or on device.

## Architecture

```
app.js              # App entrypoint (BaseApp from @zeppos/zml/base-page)
app.json            # Manifest: appId, targets, permissions, platforms
page/
  books/            # Book list (A.T./N.T. tabs) — entry page
  chapters/         # Chapter grid for selected book
  reading/          # Verse-by-verse reading; saves bookmark + progress on open
  settings/         # Font size, color, family preferences
  options/          # Mark all read/unread, clear all progress
utils/
  bible-meta.js     # BOOKS[66], NT_START=39
  fs-helper.js      # readChapter(bookIndex, chapterIndex) → string[]
  bookmark.js       # saveBookmark / loadBookmark (localStorage)
  progress.js       # markChapterRead, getBookProgress, markAllRead, etc.
  settings.js       # loadSettings / saveSettings, FONT_SIZES, TEXT_COLORS
  vstack.js         # vstack(startY, gap) helper for vertical layout
  config/
    device.js       # DEVICE_WIDTH, DEVICE_HEIGHT via getDeviceInfo()
    layout.js       # COMMON_LAYOUT, getListItemLayout()
```

## Dual-screen support

Two device profiles are supported: `r` (round, 480 px) and `s` (square, 390 px). Each page has layout files:

- `index.r.layout.js` — layout values for round screen
- `index.s.layout.js` — layout values for square screen

Import with the `zosLoader` macro — resolved at build time:

```js
import { LAYOUT } from "zosLoader:./index.[pf].layout.js";
```

Bible text assets also follow this split: `assets/common.r/data/{bookIndex}/{chapterIndex}.txt` and `assets/common.s/data/...`.

## ZOS UI conventions

- Create widgets: `hmUI.createWidget(hmUI.widget.TYPE, props)`
- Import: `import * as hmUI from "@zos/ui"`
- **All sizes/coordinates must use `px()` from `@zos/utils`**
- Font sizes in free `TEXT` widgets: `hmUI.sp()`
- Colors as hex integers: `0xRRGGBB` (e.g. `0x333333`)

## Page structure

```js
import { BasePage } from "@zeppos/zml/base-page";
Page(
  BasePage({
    state: {},
    onInit(params) { /* params are JSON.stringify'd */ },
    build() { /* create widgets here */ },
  }),
);
```

Navigation: `push` to go forward, `replace` for same-level navigation. Params passed as `JSON.stringify`'d strings.

## Pitfalls

- `LAYOUT` is page-local; don't mix layouts between pages.
- `DEVICE_HEIGHT` comes from `utils/config/device.js`, not from `LAYOUT`.
- `SCROLL_LIST` requires `item_config` as array and `item_config_count`.
- Bible data files are in `assets/` (read via `@zos/fs`), not bundled as JS modules.
- `readChapter` returns `null` on error — always guard the result.
