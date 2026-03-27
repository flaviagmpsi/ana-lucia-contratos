# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Site de contratos para a contadora Ana Lúcia Gonçalves (Essencial Contabilidade). Cada aba do site corresponde a um modelo de contrato diferente que ela usa no dia a dia. O site permite preencher campos variáveis (dados do contratante, honorários, datas) e exportar o contrato em DOCX ou PDF.

Projeto irmão de `contrato-terapeutico` — mesma stack e padrões de UI.

## Tech Stack

- **React 19** + **Vite** (build tool), deployed to GitHub Pages (`base: '/ana-lucia-contratos/'` in vite.config.js)
- Styling: CSS-in-JS inline (sem arquivos CSS externos)
- Fonts: Outfit (headings) + DM Sans (body) via Google Fonts
- Export: DOCX via Blob (`application/msword`), PDF via `window.print()`
- No linter, formatter, or test runner configured — zero dev dependencies beyond Vite + plugin-react

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

## Deployment

Pushes to `main` auto-deploy to GitHub Pages via `.github/workflows/deploy.yml` (Node 20, `npm ci && npm run build`, uploads `dist/`). Always run `npm run build` locally before pushing to catch errors.

## Architecture

Single-file React app (~3600 lines) in `src/app.jsx`. No external components or modules.

**Current contract types (8):** prestacao, parceria, social, cabeleireiro, inatividade, alteracao, distrato, paralisacao — defined in `CONTRACT_TYPES` array (~line 1184).

**Data layer** (per contract type, suffixed by type name e.g. `_PRESTACAO`, `_PARCERIA`, `_SOCIAL`, `_CABELEIREIRO`, `_INATIVIDADE`, `_ALTERACAO`, `_DISTRATO`, `_PARALISACAO`):
- `DEFAULT_DATA_*` — default form values; contratada fields pre-filled with Ana Lúcia's info, contratante fields empty
- `FIELD_GROUPS_*` — array of `{ title, icon, fields[] }` driving the form UI
- `CLAUSE_ITEMS_*` — sidebar clause navigation items with `{ icon, label, id }` where `id` matches an element in the preview

**Registry:**
- `CONTRACT_TYPES` — array of `{ id, label, icon }` for available tabs; add new contracts here
- `configs` object inside `App()` (~line 3460) — maps each contract type id to its `{ data, setData, fieldGroups, clauseItems, exportDOCX, exportPDF, Paper }`. This is the central wiring point.

**Dual rendering (must stay in sync):**
- `buildContractHTML*(d)` — generates an HTML string used for DOCX/PDF export
- `ContractPaper*` — JSX component for the live preview

These two render the same contract content in different ways. Any clause text change must be made in both. The `buildContractHTML` version uses template literals with inline styles; the `ContractPaper` version uses React JSX with inline style objects.

**Shared UI components:**
- `ContractEditor` — split-pane layout (form left, preview right)
- `SidebarContent` — collapsible sidebar with contract type tabs + clause navigation
- `Field` — renders a single form input
- `ActionBtn` — styled button for export actions

**Color palette:** All colors live in the `C` constant at the top of the file. Every inline style references `C.*` — never use raw hex values elsewhere.

**Naming convention:** The first contract type (prestacao) uses unsuffixed names (`buildContractHTML`, `exportDOCX`, `exportPDF`, `ContractPaper`). All other types use suffixed names (`buildContractHTMLParceria`, `ContractPaperSocial`, etc.).

## Adding a New Contract Type

1. Add `DEFAULT_DATA_NEWTYPE` with pre-filled contratada fields and empty contratante fields
2. Add `FIELD_GROUPS_NEWTYPE` array of form sections
3. Add `CLAUSE_ITEMS_NEWTYPE` for sidebar clause navigation
4. Add entry to `CONTRACT_TYPES` array with `{ id: "newtype", label: "...", icon: "..." }`
5. Add `buildContractHTMLNewtype(d)` for export + `exportDOCXNewtype(d)` + `exportPDFNewtype(d)`
6. Add `ContractPaperNewtype` component for live preview (must mirror the export HTML exactly)
7. In `App()`: add `useState({ ...DEFAULT_DATA_NEWTYPE })` and add an entry to the `configs` object

## Key Patterns

- Live preview updates in real-time as user types (React controlled inputs)
- Empty fields show gray italic placeholder text in preview, `________` in exports
- Contratada (Ana Lúcia / Essencial Contabilidade) data comes pre-filled
- Responsive: desktop (sidebar + form + preview), tablet (no sidebar), mobile (stacked form/preview)
- Sidebar clause items scroll to the corresponding section in the preview panel via `scrollToId()`
- DOCX export wraps HTML in MS Office XML namespace headers; PDF export opens a new window and calls `window.print()`
