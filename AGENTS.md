# bible-zepp — Agent Instructions

Aplicativo de leitura bíblica (NVI) para smartwatches ZeppOS. Escrito em JavaScript puro, sem TypeScript.

## Comandos essenciais

```bash
npm run dev      # zeus dev  — inicia o servidor de desenvolvimento
npm run build    # zeus build — gera o pacote de produção
npm run preview  # zeus preview — visualização no simulador
npm run bridge   # zeus bridge — conecta ao dispositivo físico
```

## Arquitetura

```
page/
  books/     — lista de livros (AT / NT) com SCROLL_LIST
  chapters/  — grade de capítulos do livro selecionado
  reading/   — exibe versos do capítulo com nav anterior/próximo
utils/
  bible-meta.js   — BOOKS[] (66 livros), NT_START = 39
  fs-helper.js    — readBookChapters(bookIndex) → chapters[][]
  vstack.js       — helper para posicionamento vertical
  config/
    device.js     — DEVICE_WIDTH, DEVICE_HEIGHT
    layout.js     — COMMON_LAYOUT (cores, tamanhos partilhados)
    constants.js  — DEFAULT_COLOR
assets/
  common.r/data/{bookIndex}/{chapterIndex}.json  — capítulo para tela round (480px)
  common.s/data/{bookIndex}/{chapterIndex}.json  — capítulo para tela square (390px)
```

**Navegação**: `push` para avançar, `replace` para navegar no mesmo nível. Params são `JSON.stringify`'d.

## Suporte a múltiplas telas

O projeto suporta dois perfis de dispositivo:

| Perfil | Sufixo | Largura |
| ------ | ------ | ------- |
| Round  | `r`    | 480 px  |
| Square | `s`    | 390 px  |

Cada página possui dois arquivos de layout:

- `index.r.layout.js` — valores para tela round
- `index.s.layout.js` — valores para tela square

O loader correto é importado automaticamente via:

```js
import { LAYOUT } from "zosLoader:./index.[pf].layout.js";
```

`[pf]` é substituído por `r` ou `s` em tempo de compilação.

## Convenções de código

### UI com ZOS

- Todos os widgets são criados com `hmUI.createWidget(hmUI.widget.TIPO, props)`
- Sempre importar `* as hmUI from "@zos/ui"`
- **Todo tamanho/coordenada deve usar `px()` de `@zos/utils`**
- Cores como hexadecimais: `0xRRGGBB` (ex: `0x333333`)

### Layout compartilhado (`COMMON_LAYOUT`)

```js
import { COMMON_LAYOUT, getListItemLayout } from "../../utils/config/layout";
// { radius, bgColor, pressColor, color, textSize, verseFontSize, navFontSize }
```

### Dados bíblicos

- `readChapter(bookIndex, chapterIndex)` retorna `string[]` — array de versículos
- Capítulos são carregados sob demanda; cada arquivo JSON contém apenas um capítulo
- Os arquivos JSON ficam em `assets/` (lidos via `@zos/fs`) — **não no bundle JS**
- Total de capítulos de um livro: `BOOKS[bookIndex].chapters` (sem precisar carregar arquivo)
- Índice dos livros: 0–65 correspondendo à ordem em `BOOKS`

### Posicionamento vertical

```js
import { vstack, PADDING } from "../../utils/vstack";
const stack = vstack(startY, PADDING);
const y1 = stack.add(height1); // retorna y e avança o cursor
const y2 = stack.add(height2);
```

### Página base

```js
import { BasePage } from "@zeppos/zml/base-page";
Page(
  BasePage({
    state: {},
    onInit(params) {
      /* recebe JSON.stringify'd params */
    },
    build() {
      /* cria widgets aqui */
    },
  }),
);
```

## Pitfalls comuns

- `LAYOUT` varia por arquivo (cada página define o seu próprio). Não misturar layouts entre páginas.
- `DEVICE_HEIGHT` vem de `utils/config/device.js`, não do `LAYOUT`.
- Ao criar `SCROLL_LIST`, passar `item_config` como array e `item_config_count`.
- `hmUI.sp()` para font-size em `TEXT` dentro de `build()` livre; `px()` para tamanhos de layout.
- Sem sistema de testes automatizados — validar com `zeus preview` ou no dispositivo.
