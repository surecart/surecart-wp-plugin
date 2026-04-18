---
name: php-list-to-wp-dataview-migrator
description: Migrate SureCart PHP `WP_List_Table` admin pages to React `@wordpress/dataviews`. Use this when converting a server-rendered list page (Coupons, Orders, Subscriptions, etc.) to a standalone client-side SPA that follows the @wordpress/edit-site pattern — one entry per admin page, RouterProvider at the top, lazy-loaded detail chunk, legacy list table kept behind a feature flag.
---

# PHP List Table → WP DataView Migrator

Migrates SureCart's `WP_List_Table`-based admin pages to React `@wordpress/dataviews`, using the **standalone per-page SPA** pattern modeled after `@wordpress/edit-site`. The legacy `WP_List_Table` stays in place behind a feature flag (`surecart_enhanced_admin_views`) so users can fall back; it's marked `@deprecated` and slated for removal in the next major.

## Architecture Overview

Each migrated admin page is a self-contained React app:

```
?page=sc-{entity}            ← single wp-admin page
  └── React root mounted on  #sc-{entity}-app
       └── createListEditApp({ pageSlug, ListComponent, loadEditComponent })
            └── <RouterProvider>
                 └── <ErrorBoundary>
                      └── useLocation() → <ListComponent> OR lazy <EditComponent>
```

**No cross-page SPA. No sidebar interception.** Clicking a different wp-admin menu item is a normal full page reload — exactly how the WordPress site editor behaves between `wp-admin/site-editor.php` and `wp-admin/edit.php`.

**Dual render.** The PHP controller checks `surecart_enhanced_admin_views`; on = SPA, off = legacy `WP_List_Table`. Both paths stay wired until the flag is removed.

Reference implementations:

-   **Products** (tabs + filters + integrations column): `packages/admin/products/`
-   **Product Collections** (simple, no tabs): `packages/admin/product-collections/`

Both use the same `createListEditApp` factory and the same `RendersEnhancedAdminView` PHP trait. Read both before migrating a new entity.

## Per-Entity File Layout

```
packages/admin/{entity}/
  ├── {Entity}App.js              # 10-line factory call — createListEditApp({ ... })
  ├── {Entity}List.js             # List view (ListHeader + useDataViewState + DataViewListLayout)
  ├── {Entity}.js                 # Detail/edit view (existing — reused from legacy edit page)
  ├── index.js                    # Mounts {Entity}App on #sc-{entity}-app
  └── {entity}-list-style.scss    # Imports shared common styles + entity-specific overrides

views/admin/{entity}/
  ├── spa.php                     # Two-liner: flash messages + <div id="sc-{entity}-app">
  └── index.php                   # Legacy WP_List_Table view (unchanged)

app/src/Controllers/Admin/{Entity}/
  ├── {Entity}Controller.php      # Uses RendersEnhancedAdminView trait; dual-renders SPA vs legacy
  └── {Entity}ScriptsController.php  # Enqueues admin/{entity}.js + scData
```

## Shared Reusable Library (do not duplicate)

`packages/admin/components/`:

| File                              | Purpose                                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `createListEditApp.js`            | Factory producing the App root — wires RouterProvider + ErrorBoundary + lazy edit chunk                       |
| `ListHeader.js`                   | Shared `<h1>` + "Add New" button header, matches WP `wp-heading-inline` / `wp-header-end` chrome              |
| `PageLoader.js`                   | Spinner shown while the lazy edit chunk loads                                                                 |
| `ProductThumbnail.js`             | 40×40 product image with SVG placeholder fallback                                                             |
| `error-boundary/`                 | Error boundary wrapper                                                                                        |

`packages/admin/components/dataview-list/`:

| File                        | Purpose                                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `useDataViewState.js`       | Hook: view state, query building, data fetching, status tabs, custom filters. Persists view to `@wordpress/preferences` under scope `surecart/dataview-lists` |
| `DataViewListLayout.js`     | Component: tabs, header controls, card-wrapped DataViews table                                                        |
| `ConfirmDeleteModal.js`     | Modal: reusable deletion confirmation with async busy state — accepts `items` array, works for both single row and bulk |
| `dataview-list-common.scss` | Shared styles: viewport-fit layout, checkbox visibility, padding, hover, footer, popover, `.sc-list-header`           |
| `index.js`                  | Barrel export — also imports `@wordpress/dataviews/build-style/style.css` so each consuming bundle ships its own copy |

`packages/admin/router/` (already established, used by Settings):

| File         | Purpose                                                  |
| ------------ | -------------------------------------------------------- |
| `index.js`   | `RouterProvider`, `useLocation`, `useHistory`            |
| `useLink.js` | `useLink({ params })` → `{ href, onClick }`              |
| `history.js` | `history` library wrapper with `getLocationWithParams()` |

`packages/admin/hooks/useAdminSpaNavigation.js` — wraps `useLocation`/`useHistory` to give list/edit components a single `navigation` object with `isList` / `isEdit` flags and `goToList` / `goToCreate` / `goToEdit` helpers. `createListEditApp` calls it once and passes the result down as `navigation` to both the list and the edit component.

`packages/admin/hooks/useProductIntegrations.js` — reference pattern for list columns that need a secondary round-trip (integrations per product). Takes `records`, returns a `{ integrationsByProduct, providers, itemLabels }` tuple. Uses `AbortController` + a `prevKeyRef` to avoid re-fetching on unrelated re-renders. Copy the shape for any column that needs its own fetch.

`app/src/Controllers/Admin/RendersEnhancedAdminView.php` — PHP trait centralizing three things every migrated controller needs:

```php
trait RendersEnhancedAdminView {
    protected function enqueueSpaScripts( string $scriptsController ): void;
    protected function renderSpaView( string $view, string $breadcrumbKey, string $title );
    protected function isEnhancedAdminViewsEnabled(): bool;
}
```

## Migration Checklist

### 1. Verify entity registration

Check `packages/admin/store/add-entities.js` for the entity:

```js
{
  name: 'product',
  kind: 'surecart',
  label: __('Product', 'surecart'),
  baseURL: '/surecart/v1/products',
  baseURLParams: { context: 'edit' },
  supportsPagination: true,   // REQUIRED — without it useEntityRecords returns no totalItems/totalPages
}
```

### 2. Create the list component

Pattern (copy from `packages/admin/products/ProductsList.js` or `product-collections/ProductCollectionsList.js`):

```jsx
/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { useMemo, useCallback } from 'react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { Icon } from '@wordpress/components';
import { trash, edit, external } from '@wordpress/icons';

import {
    DataViewListLayout,
    useDataViewState,
    ConfirmDeleteModal,
} from '../components/dataview-list';
import ListHeader from '../components/ListHeader';
import './entity-list-style.scss';

const SORT_MAP = { name: 'name', date: 'cataloged_at' };
const STATUS_TABS = [
    { value: 'active', label: __('Active', 'surecart') },
    { value: 'archived', label: __('Archived', 'surecart') },
    { value: 'all', label: __('All', 'surecart') },
];
const LAYOUT_STYLES = { name: { width: '25%' }, featured: { width: '60px' } };
const DEFAULT_FIELDS = ['name', 'price', 'date'];
const PREFERENCE_KEY = 'entity-list-view';

export default function EntityList({ navigation }) {
    const { deleteEntityRecord } = useDispatch(coreStore);
    const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);

    const {
        view, setView, status, setStatus, filters, setFilter,
        records, hasResolved, paginationInfo, invalidateList,
    } = useDataViewState({
        entity: 'entity',
        defaultSort: { field: 'date', direction: 'desc' },
        sortMap: SORT_MAP,                                  // omit if no sort-field rename needed
        defaultFields: DEFAULT_FIELDS,
        layoutStyles: LAYOUT_STYLES,
        preferenceKey: PREFERENCE_KEY,                      // persists view to @wordpress/preferences
        initialFilters: INITIAL_FILTERS,                    // see step 7
        buildQueryArgs: ({ status, filters }) => {
            const args = {};
            if (status === 'active') args.archived = false;
            else if (status === 'archived') args.archived = true;
            return args;
        },
    });

    const fields = useMemo(() => [/* see step 9 */], []);

    const handleDelete = useCallback(async (items) => {
        try {
            await Promise.all(
                items.map((item) =>
                    deleteEntityRecord('surecart', 'entity', item.id, { throwOnError: true })
                )
            );
            invalidateList();
            createSuccessNotice(
                sprintf(
                    _n('Successfully deleted %d item.', 'Successfully deleted %d items.', items.length, 'surecart'),
                    items.length
                ),
                { type: 'snackbar' }
            );
        } catch (error) {
            createErrorNotice(error?.message || __('Failed to delete.', 'surecart'), { type: 'snackbar' });
        }
    }, [deleteEntityRecord, createSuccessNotice, createErrorNotice, invalidateList]);

    const actions = useMemo(() => [/* see step 11 — includes handleDelete via ConfirmDeleteModal */], [handleDelete, navigation]);

    return (
        <>
            <ListHeader
                title={__('Entities', 'surecart')}
                actionLabel={__('Add Entity', 'surecart')}
                actionHref={addQueryArgs('admin.php', { page: 'sc-entity', action: 'edit' })}
                onAction={() => navigation.goToCreate()}
            />
            <DataViewListLayout
                tabs={STATUS_TABS}
                activeTab={status}
                onTabChange={setStatus}
                data={records}
                fields={fields}
                view={view}
                onChangeView={setView}
                paginationInfo={paginationInfo}
                actions={actions}
                isLoading={!hasResolved}
            />
        </>
    );
}
```

The `navigation` prop is passed in by `createListEditApp`. Use `navigation.goToEdit(item.id)` for row edit links and `navigation.goToCreate()` for the header action — never `window.location.href`.

### 3. Create the App root (`{Entity}App.js`)

Ten lines. Just configure the factory:

```js
/**
 * {Entity}App — SPA root for `?page=sc-{entity}`.
 */
import createListEditApp from '../components/createListEditApp';
import {Entity}List from './{Entity}List';

export default createListEditApp({
    pageSlug: 'sc-{entity}',
    ListComponent: {Entity}List,
    loadEditComponent: () =>
        import(/* webpackChunkName: "sc-{entity}-detail" */ './{Entity}'),
});
```

The factory wires `RouterProvider`, `ErrorBoundary`, `useAdminSpaNavigation`, the `.wrap` class on the list, and a `<Suspense>` fallback for the lazy edit chunk. Do not add cross-page DOM syncing, sidebar interception, or `useEffect`s that mutate elements outside the app root — the factory intentionally doesn't do those.

### 4. Create the entry (`packages/admin/{entity}/index.js`)

```js
import { createRoot } from '@wordpress/element';

import EntityApp from './EntityApp';
import '../store/add-entities';

const container = document.getElementById('sc-{entity}-app');
if (container) {
    createRoot(container).render(<EntityApp />);
}
```

### 5. Add the webpack entry

`webpack.config.js`:

```js
['admin/{entity}']: path.resolve(__dirname, 'packages/admin/{entity}/index.js'),
```

### 6. Create the PHP view

`views/admin/{entity}/spa.php` — two lines. No header, no "Add New" button, no `wp-heading-inline`. The React `ListHeader` renders all of that now:

```php
<?php \SureCart::render( 'components/admin/flash-messages' ); ?>
<div id="sc-{entity}-app"></div>
```

Leave `views/admin/{entity}/index.php` (the legacy `WP_List_Table` view) in place — it still renders when the feature flag is off.

### 7. Wire the PHP controller

Dual-render via the shared trait. Copy from `ProductsController.php` or `ProductCollectionsController.php`:

```php
<?php

namespace SureCart\Controllers\Admin\{Entity};

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\RendersEnhancedAdminView;

class {Entity}Controller extends AdminController {
    use RendersEnhancedAdminView;

    private function render{Entity}Spa() {
        return $this->renderSpaView(
            'admin/{entity}/spa',
            '{entity}',
            __( '{Entity}s', 'surecart' )
        );
    }

    private function renderLegacyView() {
        $table = new {Entity}ListTable();
        $table->prepare_items();

        $this->withHeader( [
            'breadcrumbs' => [
                '{entity}' => [ 'title' => __( '{Entity}s', 'surecart' ) ],
            ],
        ] );

        return \SureCart::view( 'admin/{entity}/index' )->with( [ 'table' => $table ] );
    }

    public function index() {
        if ( $this->isEnhancedAdminViewsEnabled() ) {
            $this->enqueueSpaScripts( {Entity}ScriptsController::class );
            return $this->render{Entity}Spa();
        }

        return $this->renderLegacyView();
    }

    public function edit( $request ) {
        $this->enqueueSpaScripts( {Entity}ScriptsController::class );
        // …optional preloadPaths() for the detail view…
        return $this->render{Entity}Spa();
    }
}
```

Mark the legacy `WP_List_Table` class `@deprecated`:

```php
/**
 * @deprecated 4.1.1 Use the React DataViews list at packages/admin/{entity}/.
 *                   Scheduled for removal in 5.0.0.
 */
class {Entity}ListTable extends \WP_List_Table { … }
```

`{Entity}ScriptsController.php` — extends `AdminModelEditController`, sets `$handle = 'surecart/scripts/admin/{entity}'` and `$path = 'admin/{entity}'`. Copy from `ProductScriptsController.php`.

### 8. URL parameter pre-filtering

If the legacy page supports `?sc_collection=xxx`-style deep links, seed filters at module scope:

```js
import { getQueryArgs } from '@wordpress/url';

const URL_PARAMS = getQueryArgs(window.location.href);
const INITIAL_FILTERS = URL_PARAMS.sc_collection
    ? { collectionId: URL_PARAMS.sc_collection }
    : {};
```

Pass `INITIAL_FILTERS` to `useDataViewState` so the `ModelSelector` reflects the pre-selected value on first render.

### 9. Map PHP columns → fields

For each column in the legacy `get_columns()`, define a field:

```js
const fields = useMemo(() => [
    {
        id: 'name',
        label: __('Name', 'surecart'),
        enableSorting: true,
        enableGlobalSearch: true,
        render: ({ item }) => (
            <div css={css`display:flex;align-items:center;gap:12px;`}>
                <ProductThumbnail product={item} />
                <a
                    href={addQueryArgs('admin.php', { page: 'sc-products', action: 'edit', id: item.id })}
                    onClick={(e) => { e.preventDefault(); navigation.goToEdit(item.id); }}
                >
                    {item?.name}
                </a>
            </div>
        ),
    },
    {
        id: 'featured',
        label: __('Featured', 'surecart'),
        render: ({ item }) => (
            <Icon icon={item?.featured ? starFilled : starEmpty} size={18} />
        ),
    },
    {
        id: 'price',
        label: __('Price', 'surecart'),
        render: ({ item }) => item?.range_display_amount || '-',
    },
    {
        id: 'date',
        label: __('Created', 'surecart'),
        enableSorting: true,
        render: ({ item }) => item?.cataloged_at_date_time || '-',
    },
], []);
```

Rules:

-   `enableSorting: true` only for columns in PHP `get_sortable_columns()`
-   `enableGlobalSearch: true` only on the primary search field
-   Column widths via `layoutStyles` (DataViews `layout.styles` API), **never** CSS `nth-child`
-   Right-align quantitative data; left-align text/dates
-   Use `ProductThumbnail` for any product image cell — do not reinline the SVG placeholder
-   Use `Icon` + `starFilled`/`starEmpty` for featured star — do not render raw SVG
-   Don't pass `sortMap` if field ids already match API sort names (it defaults to `{}`). Removing a no-op `SORT_MAP = { created: 'created_at' }` is always safe when every field has `enableSorting: false`.

### 10. Map PHP filter dropdowns → ModelSelector

Use SureCart's `ModelSelector`, never a native `<select>`. Pass as `headerControls` on `DataViewListLayout`.

### 11. Map PHP row actions → DataViews actions (delete unified via `ConfirmDeleteModal`)

The same `ConfirmDeleteModal` handles both single-row delete and bulk delete. It takes an `items` array; the row action passes `[item]`, bulk passes the whole selection. Wire one `handleDelete` callback that maps over `items` — don't branch between single and bulk paths.

```js
const actions = useMemo(() => [
    {
        id: 'edit',
        label: __('Edit', 'surecart'),
        icon: <Icon icon={edit} />,
        isPrimary: true,
        callback: ([item]) => navigation.goToEdit(item.id),
    },
    {
        id: 'view',
        label: __('View', 'surecart'),
        icon: <Icon icon={external} />,
        isEligible: (item) => !!item.permalink,
        callback: ([item]) => window.open(item.permalink, '_blank'),
    },
    {
        id: 'delete',
        icon: <Icon icon={trash} />,
        label: __('Delete permanently', 'surecart'),
        isDestructive: true,
        isPrimary: true,
        supportsBulk: true,
        hideModalHeader: true,
        RenderModal: ({ items, closeModal }) => (
            <ConfirmDeleteModal
                items={items}
                closeModal={closeModal}
                onDelete={handleDelete}
                message={sprintf(
                    _n(
                        'Are you sure you want to permanently delete %d item?',
                        'Are you sure you want to permanently delete %d items?',
                        items.length,
                        'surecart'
                    ),
                    items.length
                )}
            />
        ),
    },
], [handleDelete, navigation]);
```

After any mutation, **call `invalidateList()`** — `saveEntityRecord` / `deleteEntityRecord` / `apiFetch` do not refresh the list query on their own.

The legacy `confirmBulkDelete` / `bulkDelete` PHP controller methods and their routes stay wired until the legacy table is deleted — the legacy list table emits the `bulk_action_*_ids[]` checkbox inputs that feed them.

### 12. SCSS

```scss
// packages/admin/{entity}/{entity}-list-style.scss
@import '../components/dataview-list/dataview-list-common.scss';
// Entity-specific overrides only if needed (usually none).
```

The shared SCSS provides viewport-fit layout, checkbox visibility, padding, hover, footer, popover constraints, and the `.sc-list-header` rules used by `ListHeader`. The vendor CSS (`@wordpress/dataviews/build-style/style.css`) is imported by `dataview-list/index.js` — it ships with the bundle that uses the components. Do not import it again.

## useDataViewState API

```js
const {
    view,
    setView,
    status,
    setStatus, // resets page to 1
    filters,
    setFilter, // setFilter('key', value) — resets page to 1
    records,
    hasResolved,
    paginationInfo,
    invalidateList, // call after mutations
    queryArgs, // for debugging
} = useDataViewState({
    entity: 'product',
    kind: 'surecart', // default
    defaultSort: { field: 'date', direction: 'desc' },
    sortMap: { name: 'name', date: 'cataloged_at' }, // optional — view field → API field
    defaultFields: ['name', 'price', 'date'],
    perPage: 20,
    defaultStatus: 'active',
    layoutStyles: { name: { width: '25%' } },
    initialFilters: {},
    buildQueryArgs: ({ view, status, filters }) => ({}),
    preferenceKey: 'products-list-view', // persists { fields, layout, perPage, sort, filters }
});
```

View persistence is handled entirely by `@wordpress/preferences` under scope `surecart/dataview-lists`. Pick a unique `preferenceKey` per list. Transient state (`page`, `search`) is intentionally not persisted.

## DataViewListLayout Props

```jsx
<DataViewListLayout
    tabs={[{ value: 'active', label: 'Active' }]}      // optional
    activeTab="active"
    onTabChange={(value) => {}}
    headerControls={<ModelSelector ... />}             // optional
    header={<Button>Export</Button>}                   // rendered next to gear icon
    data={records}
    fields={fields}
    view={view}
    onChangeView={setView}
    paginationInfo={paginationInfo}
    actions={actions}
    isLoading={!hasResolved}
    isMutating={isMutating}
/>
```

## Common Pitfalls

1. **Don't use `filterSortAndPaginate`** with server-side data — re-paginates client-side
2. **Don't use `table-layout: fixed`** — text overlap. Use `layout.styles` for column widths
3. **Don't use CSS `nth-child` for column widths** — fragile; use `layout.styles`
4. **Don't set `titleField`** unless you want a duplicate combined primary column
5. **Use `@emotion/react`** (not `@emotion/core`) for the css prop
6. **Text domain must be `'surecart'`**
7. **Use `range_display_amount`** for price display
8. **Use `ModelSelector`**, not native `<select>`, for filter dropdowns
9. **Always check `hasResolved`** (or `isLoading={!hasResolved}`) before rendering
10. **Tabs are WP-style text links** (`<ul>/<li>/<a>`) — not button groups or `TabPanel`
11. **Settings popover is a portal** — `.dataviews-view-config` renders at body level. Width constraints belong at global scope in `dataview-list-common.scss`
12. **Always call `invalidateList()` after mutations** — `saveEntityRecord` / `deleteEntityRecord` / `apiFetch` don't refresh the list on their own
13. **Seed filters from URL params at module scope** — `getQueryArgs(window.location.href)` outside the component, pass as `initialFilters`
14. **Use `navigation.goToEdit(id)` for edit links** — not `window.location.href`
15. **`spa.php` has no `<h1>` or "Add New" button** — the React `ListHeader` renders them. Don't port the legacy page header into the spa view
16. **One `handleDelete` for single + bulk** — `ConfirmDeleteModal` takes `items`; the row action wraps one item in an array. Don't branch into two code paths
17. **`useAdminSpaNavigation` is consumed by `createListEditApp`** — don't call it again in the list/edit component; read the `navigation` prop that the factory passes in
18. **Don't touch DOM outside the app root** — `createListEditApp` deliberately doesn't sync sidebars, menu items, or external headers. If the design wants a toolbar control, render it inside `DataViewListLayout` via `header` or `headerControls`
19. **Keep the `@deprecated` annotation current** — when a legacy list table is removed, bump the target version or drop the annotation in the same PR
20. **Each page is its own webpack entry, PHP controller, view, and React root** — there is no shared shell or page registry. Keep the file layout strictly per-entity

## Quick Migration Template

To migrate Orders:

1. **`packages/admin/orders/OrdersList.js`** — copy `ProductsList.js`; update entity, sort map, tabs, fields, `handleDelete`, actions
2. **`packages/admin/orders/OrdersApp.js`** — 10-line `createListEditApp({ pageSlug: 'sc-orders', ListComponent: OrdersList, loadEditComponent: () => import('./Order') })`
3. **`packages/admin/orders/index.js`** — mount `<OrdersApp />` on `#sc-orders-app`
4. **`packages/admin/orders/order-list-style.scss`** — `@import "../components/dataview-list/dataview-list-common.scss";`
5. **`webpack.config.js`** — add `['admin/orders']: 'packages/admin/orders/index.js'`
6. **`views/admin/orders/spa.php`** — two lines: flash messages + `<div id="sc-orders-app">`
7. **`app/src/Controllers/Admin/Orders/OrdersController.php`** — `use RendersEnhancedAdminView;`, dual-render via `isEnhancedAdminViewsEnabled()`
8. **`app/src/Controllers/Admin/Orders/OrdersListTable.php`** — add `@deprecated {current-version}` docblock
9. **`app/src/Controllers/Admin/Orders/OrdersScriptsController.php`** — `$handle = 'surecart/scripts/admin/orders'`, `$path = 'admin/orders'`

That's it.
