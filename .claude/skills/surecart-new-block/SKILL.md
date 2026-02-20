---
name: surecart-new-block
description: Use this skill when the user wants to create a new SureCart Gutenberg block, add a next-gen block, build a WordPress Interactivity API block for SureCart, or scaffold a new block in packages/blocks-next/. Scaffolds block.json, controller.php, view.php, edit.js, and auto-adds preload entry in app/config.php if Stencil sc-* components are used.
version: 1.0.0
---

# New SureCart Next-Gen Block

Guided workflow for creating a complete next-gen SureCart block using the WordPress Interactivity API. All new blocks go in `packages/blocks-next/` — never in the legacy `packages/blocks/` system.

## Instructions

### Step 1 — Gather Requirements

Ask the user for:
1. **Block name** — kebab-case (e.g., `product-rating`, `order-summary`, `cart-badge`)
2. **Block title** — human-readable for the editor (e.g., "Product Rating")
3. **Purpose** — what does this block display or do?
4. **Stencil components** — does it use any `sc-*` web components? Which ones? (This determines if a preload entry is needed)
5. **Inner blocks** — is this a container block that renders child blocks via `$content`?
6. **Product context** — only needed on product detail pages? (Use `sc_get_product()` only if yes)

### Step 2 — Read Existing Patterns

Read an existing similar block from `packages/blocks-next/src/blocks/` to match current patterns:
- For a display block: read `packages/blocks-next/src/blocks/product-price/`
- For a cart/checkout block: read `packages/blocks-next/src/blocks/cart/`
- For a container block: read `packages/blocks-next/src/blocks/product/`

Also read `packages/blocks-next/src/blocks/product-price/block.json` to understand the current block.json schema in use.

### Step 3 — Read Preload Format (if Stencil components used)

If the block uses any `sc-*` Stencil components, use Grep to search for `'preload'` in `app/config.php`, then read the surrounding 30 lines to understand the exact preload array format before inserting.

### Step 4 — Invoke the Block Builder Agent

Use the `surecart-block-builder` agent with all gathered context:

Provide the agent: block name (kebab-case), title, purpose, Stencil components used (or none), whether it's a container block, and whether product context is required.

### Step 5 — Verify

After the builder completes, verify:
- [ ] `packages/blocks-next/src/blocks/{block-name}/block.json` exists with `"apiVersion": 3` and `"name": "surecart/{block-name}"`
- [ ] `packages/blocks-next/src/blocks/{block-name}/controller.php` exists
- [ ] `packages/blocks-next/src/blocks/{block-name}/view.php` exists with `data-wp-interactive` attribute
- [ ] `packages/blocks-next/src/blocks/{block-name}/edit.js` exists
- [ ] `packages/blocks-next/src/blocks/{block-name}/index.js` exists and calls `registerBlockType(metadata.name, { ... })`

**If Stencil components were specified:**
- [ ] `app/config.php` 'preload' array contains entry for `'surecart/{block-name}'`

If the preload entry is missing and `sc-*` components are used, add it now — missing it causes layout shift in production.

### Step 6 — Build Reminder

Remind the user:
```
Block created. To see it in the editor, run:
  yarn dev   (development watch mode)

Note: If you modified Stencil components (packages/components/),
run yarn bootstrap first to rebuild component types.
```

### Step 7 — Report

```
Created next-gen block surecart/{block-name}:
- block.json: packages/blocks-next/src/blocks/{block-name}/block.json
- controller.php: server-side render logic
- view.php: Interactivity API template (namespace: surecart/{namespace})
- edit.js: block editor component
- index.js: block registration entry point
- Preload entry added in app/config.php ✓  (if sc-* components used)
```
