---
name: php-list-to-wp-dataview-migrator
description: Migrate SureCart PHP `WP_List_Table` admin pages to React `@wordpress/dataviews`. Use this when converting a server-rendered list page (Coupons, Orders, Subscriptions, etc.) to a standalone client-side SPA that follows the @wordpress/edit-site pattern — one entry per admin page, RouterProvider at the top, lazy-loaded detail chunk.
---

# PHP List Table → WP DataView Migrator

Migrates SureCart's `WP_List_Table`-based admin pages to React `@wordpress/dataviews`, using the **standalone per-page SPA** pattern modeled after `@wordpress/edit-site`.

## Architecture Overview

Each migrated admin page is a self-contained React app:

```
?page=sc-{entity}            ← single wp-admin page
  └── React root mounted on  #sc-{entity}-app
       └── <RouterProvider>          ← from packages/admin/router
            └── <ErrorBoundary>
                 └── useLocation() → list view OR lazy-loaded detail chunk
```

**No cross-page SPA. No sidebar interception.** Clicking a different wp-admin menu item is a normal full page reload — exactly how the WordPress site editor behaves between `wp-admin/site-editor.php` and `wp-admin/edit.php`.

Reference implementations:

-   **Products** (with tabs + filters): `packages/admin/products/`
-   **Product Collections** (simple, no tabs): `packages/admin/product-collections/`

Both follow the identical pattern. Read both before migrating a new entity.

## Per-Entity File Layout

```
packages/admin/{entity}/
  ├── {Entity}App.js              # Router root (RouterProvider + ErrorBoundary + lazy detail)
  ├── {Entity}List.js             # List view (useDataViewState + DataViewListLayout)
  ├── {Entity}.js                 # Detail/edit view (existing — already used by the legacy edit page)
  ├── index.js                    # Mounts {Entity}App on #sc-{entity}-app
  └── {entity}-list-style.scss    # Imports shared common styles + entity-specific overrides

views/admin/{entity}/
  └── spa.php                     # Page header + <div id="sc-{entity}-app">

app/src/Controllers/Admin/{Entity}/
  ├── {Entity}Controller.php      # index() / edit() — calls enqueueSpaScripts() + renderSpaView()
  └── {Entity}ScriptsController.php  # Enqueues admin/{entity}.js + scData

webpack.config.js                 # New entry: ['admin/{entity}']: 'packages/admin/{entity}/index.js'
```

## Shared Reusable Library (do not duplicate)

`packages/admin/components/dataview-list/`:

| File                        | Purpose                                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `useDataViewState.js`       | Hook: view state, query building, data fetching, status tabs, custom filters                                          |
| `DataViewListLayout.js`     | Component: tabs, header controls, card-wrapped DataViews table                                                        |
| `ConfirmDeleteModal.js`     | Modal: reusable deletion confirmation with async busy state                                                           |
| `dataview-list-common.scss` | Shared styles: viewport-fit layout, checkbox visibility, padding, hover, footer, popover                              |
| `index.js`                  | Barrel export — also imports `@wordpress/dataviews/build-style/style.css` so each consuming bundle ships its own copy |

`packages/admin/router/` (already established, used by Settings):

| File         | Purpose                                                  |
| ------------ | -------------------------------------------------------- |
| `index.js`   | `RouterProvider`, `useLocation`, `useHistory`            |
| `useLink.js` | `useLink({ params })` → `{ href, onClick }`              |
| `history.js` | `history` library wrapper with `getLocationWithParams()` |

`packages/admin/hooks/useAdminSpaNavigation.js` — thin shim over `useLocation`/`useHistory` that returns `{ action, id, isList, isCreate, isEdit, goToList, goToCreate, goToEdit }`. Pass the page slug; the shim reads URL params and exposes navigation helpers. New code should prefer `useHistory()`/`useLink()` directly; the shim exists so existing list/detail components keep working.

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

Pattern (copy from `packages/admin/products/ProductsList.js`):

```jsx
/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';
import { useMemo, useCallback } from 'react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { DataViewListLayout, useDataViewState } from '../components/dataview-list';
import './entity-list-style.scss';

const SORT_MAP = { name: 'name', date: 'cataloged_at' };
const STATUS_TABS = [
  { value: 'active', label: __('Active', 'surecart') },
  { value: 'archived', label: __('Archived', 'surecart') },
  { value: 'all', label: __('All', 'surecart') },
];
const LAYOUT_STYLES = { name: { width: '25%' }, featured: { width: '60px' } };
const DEFAULT_FIELDS = ['name', 'price', 'date'];

export default function EntityList({ navigation }) {
  const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
  const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);

  const {
    view, setView, status, setStatus, filters, setFilter,
    records, hasResolved, paginationInfo, invalidateList,
  } = useDataViewState({
    entity: 'product',
    defaultSort: { field: 'date', direction: 'desc' },
    sortMap: SORT_MAP,
    defaultFields: DEFAULT_FIELDS,
    layoutStyles: LAYOUT_STYLES,
    initialFilters: INITIAL_FILTERS,                  // see step 7
    buildQueryArgs: ({ status, filters }) => {
      const args = {};
      if (status === 'active') args.archived = false;
      else if (status === 'archived') args.archived = true;
      if (filters.collectionId) args.product_collection_ids = [filters.collectionId];
      return args;
    },
  });

  const fields = useMemo(() => [/* see step 4 */], []);
  const actions = useMemo(() => [/* see step 8 */], []);

  return (
    <DataViewListLayout
      tabs={STATUS_TABS}
      activeTab={status}
      onTabChange={setStatus}
      headerControls={/* optional ModelSelector */}
      data={records}
      fields={fields}
      view={view}
      onChangeView={setView}
      paginationInfo={paginationInfo}
      actions={actions}
      isLoading={!hasResolved}
    />
  );
}
```

The `navigation` prop comes from `useAdminSpaNavigation` (passed in by `{Entity}App.js`). Use `navigation.goToEdit(item.id)` for row edit links — never `window.location.href`.

### 3. Create the App root (`{Entity}App.js`)

Copy from `packages/admin/products/ProductsApp.js`. Substitute the entity name, slug, list component, detail import:

```jsx
import { Suspense, lazy, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';

import { RouterProvider, useHistory } from '../router';
import ErrorBoundary from '../components/error-boundary';
import EntityList from './EntityList';
import useAdminSpaNavigation from '../hooks/useAdminSpaNavigation';

const Entity = lazy(() =>
	import(/* webpackChunkName: "sc-{entity}-detail" */ './Entity')
);

const PAGE_SLUG = 'sc-{entity}';

function PageLoader() {
	/* small Spinner */
}

function useHeaderSync(isList) {
	const history = useHistory();
	useEffect(() => {
		const header = document.getElementById('sc-{entity}-list-header');
		if (header) header.style.display = isList ? '' : 'none';
	}, [isList]);

	useEffect(() => {
		const button = document.querySelector(
			'#sc-{entity}-list-header [data-test-id="add-new-button"]'
		);
		if (!button) return;
		const handleClick = (e) => {
			if (
				e.metaKey ||
				e.ctrlKey ||
				e.shiftKey ||
				e.altKey ||
				e.button !== 0
			)
				return;
			e.preventDefault();
			history.push({ page: PAGE_SLUG, action: 'edit' });
		};
		button.addEventListener('click', handleClick);
		return () => button.removeEventListener('click', handleClick);
	}, [history]);
}

function useWrapClass(isList) {
	useEffect(() => {
		const el = document.getElementById('sc-{entity}-app');
		if (el) el.classList.toggle('wrap', isList);
	}, [isList]);
}

function EntityRouter() {
	const navigation = useAdminSpaNavigation(PAGE_SLUG);
	useHeaderSync(navigation.isList);
	useWrapClass(navigation.isList);

	if (navigation.isList) return <EntityList navigation={navigation} />;
	return (
		<Suspense fallback={<PageLoader />}>
			<Entity navigation={navigation} />
		</Suspense>
	);
}

export default function EntityApp() {
	return (
		<RouterProvider>
			<ErrorBoundary>
				<EntityRouter />
			</ErrorBoundary>
		</RouterProvider>
	);
}
```

The two effects (`useHeaderSync`, `useWrapClass`) are scoped to this page only — they only touch DOM elements that belong to it. No sidebar mutation, no cross-page coordination.

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

`views/admin/{entity}/spa.php`:

```php
<div class="wrap" id="sc-{entity}-list-header">
    <?php \SureCart::render( 'components/admin/flash-messages' ); ?>
    <h1 class="wp-heading-inline"><?php esc_html_e( '{Entity}s', 'surecart' ); ?></h1>
    <?php if ( ! empty( $new_link ) ) : ?>
        <a href="<?php echo esc_url( $new_link ); ?>" class="page-title-action" data-test-id="add-new-button">
            <?php esc_html_e( 'Add New', 'surecart' ); ?>
        </a>
    <?php endif; ?>
    <hr class="wp-header-end" />
</div>

<div id="sc-{entity}-app"></div>
```

### 7. Wire the PHP controller

`app/src/Controllers/Admin/{Entity}/{Entity}Controller.php`:

```php
use SureCart\Controllers\Admin\AdminController;

class {Entity}Controller extends AdminController {
    private function enqueueSpaScripts() {
        add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( {Entity}ScriptsController::class, 'enqueue' ) );
    }

    private function renderSpaView() {
        $this->withHeader( [ 'breadcrumbs' => [
            '{entity}' => [ 'title' => __( '{Entity}s', 'surecart' ) ],
        ] ] );

        return \SureCart::view( 'admin/{entity}/spa' )->with( [
            'new_link' => \SureCart::getUrl()->edit( '{entity}' ),
        ] );
    }

    public function index() {
        $this->enqueueSpaScripts();
        return $this->renderSpaView();
    }

    // edit() — same enqueue + view; the React app reads ?action=edit&id= from URL
}
```

`{Entity}ScriptsController.php` — extends `AdminModelEditController`, sets `$handle = 'surecart/scripts/admin/{entity}'` and `$path = 'admin/{entity}'`. Standard pattern — copy from `ProductScriptsController.php`.

### 8. URL parameter pre-filtering

If the legacy page supports `?sc_collection=xxx`-style deep links, seed filters at module scope:

```js
import { getQueryArgs } from '@wordpress/url';

const URL_PARAMS = getQueryArgs(window.location.href);
const INITIAL_FILTERS = URL_PARAMS.sc_collection
	? { collectionId: URL_PARAMS.sc_collection }
	: {};
```

Pass `INITIAL_FILTERS` to `useDataViewState` so the ModelSelector reflects the pre-selected value on first render.

### 9. Map PHP columns → fields

For each column in the legacy `get_columns()`, define a field:

```js
const fields = useMemo(() => [
  {
    id: 'name',
    label: __('Name', 'surecart'),
    enableSorting: true,
    enableGlobalSearch: true,
    render: ({ item }) => (/* image + edit link */),
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
    render: ({ item }) => formatDate(item.cataloged_at),
  },
], []);
```

Rules:

-   `enableSorting: true` only for columns in PHP `get_sortable_columns()`
-   `enableGlobalSearch: true` only on the primary search field
-   Column widths via `layoutStyles` (DataViews `layout.styles` API), **never** CSS `nth-child`
-   Right-align quantitative data; left-align text/dates

### 10. Map PHP filter dropdowns → ModelSelector

Use SureCart's `ModelSelector`, never a native `<select>`. Pass as `headerControls` on `DataViewListLayout`.

### 11. Map PHP row actions → DataViews actions

Use `navigation.goToEdit(id)` for edit; use `RenderModal` for destructive bulk actions. After any mutation, **call `invalidateList()`** — `saveEntityRecord` / `deleteEntityRecord` / `apiFetch` do not refresh the list query on their own.

### 12. SCSS

```scss
// packages/admin/{entity}/{entity}-list-style.scss
@import '../components/dataview-list/dataview-list-common.scss';
// Entity-specific overrides only if needed (usually none).
```

The shared SCSS provides viewport-fit layout, checkbox visibility, padding, hover, footer, popover constraints. The vendor CSS (`@wordpress/dataviews/build-style/style.css`) is imported by `dataview-list/index.js` — it ships with the bundle that uses the components. Do not import it again.

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
	sortMap: { name: 'name', date: 'cataloged_at' }, // view field → API field
	defaultFields: ['name', 'price', 'date'],
	perPage: 20,
	defaultStatus: 'active',
	layoutStyles: { name: { width: '25%' } },
	initialFilters: {},
	buildQueryArgs: ({ view, status, filters }) => ({}),
});
```

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
15. **Each page is its own webpack entry, PHP controller, view, and React root** — there is no shared shell or page registry. Keep the file layout strictly per-entity
16. **Modifier-clicks on "Add New"** — let the browser handle Cmd/Ctrl/Shift/middle-clicks normally. The header sync effect in `{Entity}App.js` already does this; don't simplify it away
17. **No sidebar interception** — clicking a different wp-admin menu item must full-reload. Anything else fights WordPress

## Quick Migration Template

To migrate Orders:

1. **`packages/admin/orders/OrdersList.js`** — copy `ProductsList.js`; update entity, sort map, tabs, fields, actions
2. **`packages/admin/orders/OrdersApp.js`** — copy `ProductsApp.js`; substitute `Order`/`OrdersList`/`sc-orders`
3. **`packages/admin/orders/index.js`** — mount `<OrdersApp />` on `#sc-orders-app`
4. **`packages/admin/orders/order-list-style.scss`** — `@import "../components/dataview-list/dataview-list-common.scss";`
5. **`webpack.config.js`** — add `['admin/orders']: 'packages/admin/orders/index.js'`
6. **`views/admin/orders/spa.php`** — header + `<div id="sc-orders-app">`
7. **`app/src/Controllers/Admin/Orders/OrdersController.php`** — `enqueueSpaScripts()` enqueues `OrdersScriptsController` only; `renderSpaView()` returns `admin/orders/spa`
8. **`app/src/Controllers/Admin/Orders/OrdersScriptsController.php`** — extends `AdminModelEditController`; `$handle = 'surecart/scripts/admin/orders'`, `$path = 'admin/orders'`

That's it.
