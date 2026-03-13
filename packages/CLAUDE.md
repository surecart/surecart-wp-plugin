# SureCart JS/Blocks Patterns

Patterns for working in `packages/`. See root `CLAUDE.md` for architecture overview.

## Adding a Next-Gen Block

All new blocks go here. Legacy blocks (`packages/blocks/`) are maintenance-only.

```
packages/blocks-next/src/blocks/{block-name}/
├── block.json        # apiVersion: 3, name: "surecart/{block-name}", supports: {interactivity: true}
├── controller.php    # Runs server-side on render. Has $attributes, $content, $block in scope.
│                     # Return 'file:./view.php' for template, or string for direct output.
├── view.php          # PHP template with data-wp-* directives for Interactivity API
├── edit.js           # Block editor React component
└── style.scss        # (optional) Frontend styles
```

Non-obvious wiring:
- `controller.php` is auto-detected via `block_type_metadata_settings` filter in `packages/blocks-next/index.php` — no manual render callback registration needed
- `surecart/product` block context is injected by `render_block_context` filter only when `surecart_current_product` query var is set (product detail pages). Access via `sc_get_product()` in controller.php
- If the block uses any `sc-*` Stencil components, **must** add preload entry in `app/config.php` under `'preload'` key
- Shared JS externals available: `@surecart/dialog`, `@surecart/cart`, `@surecart/sidebar`, `@surecart/api-fetch`, `@surecart/checkout-service`, `@surecart/checkout-events`

## Legacy Blocks (Maintenance Only)

- `packages/blocks/Blocks/{BlockName}/Block.php` extends `BaseBlock`
- `render($attributes, $content)` outputs Stencil component HTML strings
- Namespace: `SureCartBlocks\Blocks\{BlockName}`
- Do not add new blocks here

## Stencil Components

109 web components in `packages/components/src/components/`. Organized into: `controllers/`, `context/`, `processors/`, `providers/`, `ui/`, `util/`.

```tsx
@Component({ tag: 'sc-button', styleUrl: 'sc-button.scss', shadow: true })
export class ScButton {
    @Prop({ reflect: true }) type: 'primary' | 'success' | 'danger' = 'primary';
    @Event() scClick: EventEmitter<void>;
    render() { /* JSX */ }
}
```

**State management:**
- Simple state: `@stencil/store`
- Checkout data: `packages/components/src/store/checkout/store.ts`
- Form state machine: `packages/components/src/store/form/store.ts` (wraps xstate machine)
- State machine definition: `packages/components/src/components/providers/form-state-provider/checkout-machine.ts`

## Admin React

- Entry points in `packages/admin/` — each admin page is a separate webpack entry point defined in root `webpack.config.js`
- Redux-style stores in `packages/admin/store/` with modules: `account`, `page`, `ui`, `integration`, `notices`, `fetch`, `data`
- Each module follows shape: `reducer`, `actions`, `selectors`, `resolvers`, `controls`
- Webpack alias `@surecart/data` -> `packages/admin/store/data` — use for imports
- React wrappers for Stencil components: import from `packages/components-react/`, not `@surecart/components` directly

## Build Dependency Order

`yarn bootstrap` must run before `yarn dev`. Build sequence: Stencil components -> `components-react` wrappers -> `blocks` + `blocks-next`

- After modifying Stencil components: must rebuild components before blocks-next (blocks-next imports component types)
- `packages/blocks-next/webpack.config.js` is separate from root `webpack.config.js` — two configs (styles + scripts)
- `dist/` contains built output copied by CopyPlugin — never edit directly
