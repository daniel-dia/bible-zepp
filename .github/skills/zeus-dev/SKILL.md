---
name: zeus-dev
description: "Build and run the bible-zepp ZeppOS app for development and testing. Use when: running zeus dev, compiling the app, checking for build errors, testing on simulator, watching file changes."
argument-hint: "device id (optional, e.g. 9765120 for Amazfit Bip 6)"
---

# Zeus Dev — Build & Test

## When to Use

- Checking for compilation errors after code changes
- Starting the dev server with simulator watch mode
- Quick one-shot build without dev server

## Device IDs (Amazfit Bip 6 = Round layout)

| Device                   | ID       |
| ------------------------ | -------- |
| Amazfit Bip 6            | 9765120  |
| Amazfit Active 2 (Round) | 9765121  |
| Amazfit Balance 2        | 10158337 |

## Procedure

### One-shot build (check compilation errors)

```bash
cd /home/daniel/repos/bible-zepp/bible-zepp
zeus build --device 9765120
```

### Dev server with watch mode (requires interactive terminal)

Open a terminal manually and run:

```bash
cd /home/daniel/repos/bible-zepp/bible-zepp
zeus dev
```

Select the device from the prompt.

## Notes

- `zeus dev` requires an interactive TTY — run it in the VS Code terminal directly, not via agent commands.
- `zeus build` compiles all device targets (r and s layouts) and is safe to run non-interactively.
- A successful build ends with `[QJSC] X files, Xms, done!` and no `SyntaxError` / `build error` lines.
