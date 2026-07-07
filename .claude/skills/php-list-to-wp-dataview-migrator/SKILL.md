---
name: php-list-to-wp-dataview-migrator
description: Migrate SureCart PHP `WP_List_Table` admin pages to React `@wordpress/dataviews`. Use this when converting a server-rendered list page (Coupons, Orders, Subscriptions, etc.) to a standalone client-side SPA that follows the @wordpress/edit-site pattern — one entry per admin page, RouterProvider at the top, lazy-loaded detail chunk, legacy list table kept behind a feature flag.
---

# PHP List Table → WP DataView Migrator

Migrates SureCart's `WP_List_Table`-based admin pages to React `@wordpress/dataviews`, using the **standalone per-page SPA** pattern modeled after `@wordpress/edit-site`. The legacy `WP_List_Table` stays in place behind a feature flag (`surecart_enhanced_admin_views`) so users can fall back, and is slated for removal in the next major.

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

-   **Products** (status sidebar + faceted filters + variant rows + batch-API bulk): `packages/admin/products/`
-   **Reviews** (status sidebar + approve/reject mutations + async product elements): `packages/admin/reviews/`
-   **Product Collections** (simple, no filters/sidebar): `packages/admin/product-collections/`
-   **Product Groups** (status sidebar, archive filter, simpler than products): `packages/admin/product-groups/`

All four use the same `createListEditApp` factory and the same `RendersEnhancedAdminView` PHP trait. The per-entity `list/` directory pattern (described below) is the current convention — read Products + Reviews before migrating.

## Per-Entity File Layout

```
packages/admin/{entity}/
  ├── {Entity}App.js              # 10-line factory call — createListEditApp({ ... })
  ├── {Entity}List.js             # Slim orchestrator — wires hooks + delegates to list/ modules
  ├── {Entity}.js                 # Detail/edit view (existing — reused from legacy edit page)
  ├── index.js                    # Mounts {Entity}App on #sc-{entity}-app
  ├── {entity}-list-style.scss    # Imports shared common styles + entity-specific overrides
  └── list/                       # Modular list pieces — each composable + plugin-extendable
      ├── buildQuery.js           # view → REST args; composes filter handlers
      ├── urlFilters.js           # URL ↔ filter mapping config
      ├── useStatusTabs.js        # Status sidebar tabs + count fetcher (if entity has statuses)
      ├── fields/
      │   ├── index.js            # buildEntityFields(ctx) — composes & runs applyFieldExtensions
      │   └── {field}.js          # One module per column; default-exports a factory
      └── actions/
          └── index.js            # buildEntityActions({ navigation, handlers }) + applyActionExtensions

views/admin/{entity}/
  ├── spa.php                     # Two-liner: flash messages + <div id="sc-{entity}-app">
  └── index.php                   # Legacy WP_List_Table view (unchanged)

app/src/Controllers/Admin/{Entity}/
  ├── {Entity}Controller.php      # Uses RendersEnhancedAdminView trait; dual-renders SPA vs legacy
  └── {Entity}ScriptsController.php  # Enqueues admin/{entity}.js; sets $needs_dataviews_style = true
```

## Shared Reusable Library (do not duplicate)

`packages/admin/components/`:

| File                   | Purpose                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `createListEditApp.js` | Factory producing the App root — wires RouterProvider + ErrorBoundary + lazy edit chunk          |
| `ListHeader.js`        | Shared `<h1>` + "Add New" button header. Rendered inside `DataViewListLayout`'s `pageHeader` slot |
| `ProductThumbnail.js`  | 40×40 product image with SVG placeholder fallback                                                |
| `Notifications.js`     | Snackbar outlet; mounted by `DataViewListLayout`                                                  |
| `error-boundary/`      | Error boundary wrapper                                                                           |

`packages/admin/components/dataview-list/` — barrel exports:

| Export                         | Purpose                                                                                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useDataViewState`             | Hook: view state, query building, data fetching, URL filter sync. Persists `['fields', 'layout', 'perPage', 'sort']` to `@wordpress/preferences` under scope `surecart/dataview-lists`. Filters live in the URL, not preferences. |
| `DataViewListLayout`           | Component: workspace shell. Slots: `pageHeader`, `statusSidebar`, `header`. Owns the mutation overlay, horizontal-scroll fades, and the `<Notifications />` outlet |
| `StatusSidebar`                | Site-Editor-style left rail with site icon, heading/description, back button, and a vertical tablist with counts (WAI-ARIA tablist keyboard contract included)  |
| `EnhancedViewToggle`           | The toggle in the table header that switches between workspace shell and inline list                                                                          |
| `useEnhancedView`              | Hook: returns `{ enabled, toggle }`, persists to user pref `surecart-enhanced-admin-views-on`                                                                  |
| `ModernViewIntroModal`         | First-run onboarding modal explaining the new shell                                                                                                            |
| `DismissibleInfo`              | Inline dismissible info notice for the workspace                                                                                                              |
| `ConfirmActionModal`           | Modal: reusable confirmation with async busy state — accepts `items` array, works for single row + bulk (delete, archive, etc.)                              |
| `iconLabel`                    | `iconLabel(icon, label)` — small helper for icon+label tuple in dropdowns                                                                                     |
| `useTabRefreshKey`             | `{ refreshKey, bump }` — bump after mutations so status-tab counts re-fetch                                                                                   |
| `useAsyncEntityElements`       | Generic async loader for filter `elements`. Pass an entity name; get a stable `[{ value, label }]` list                                                       |
| `useProductElements`           | Convenience wrapper around `useAsyncEntityElements('product')` for the common Product filter column                                                            |
| `useHorizontalScrollState`     | Attaches scroll listeners that reveal/hide the fade indicators on the right edge of wide tables                                                                |
| `applyFieldExtensions`         | `applyFilters('surecart.dataview.{screen}.fields', …)` — applied inside the entity's `buildXxxFields` composer                                                 |
| `applyActionExtensions`        | `applyFilters('surecart.dataview.{screen}.actions', …)` — applied inside `buildXxxActions`                                                                    |
| `applyFilterHandlerExtensions` | `applyFilters('surecart.dataview.{screen}.filterHandlers', …)` — applied inside `buildXxxQuery`                                                               |
| `applyDefaultFieldsExtensions` | `applyFilters('surecart.dataview.{screen}.defaultFields', …)` — applied in the list component before passing to `useDataViewState`                            |
| `buildBaseQuery`               | view → REST args; takes `defaultSort` + `sortMap`. Returns pagination + sort + search                                                                          |
| `buildQueryFromView`           | Full query: `buildBaseQuery` + filter handler chain. Used directly only when no entity-specific args are needed                                                |
| `buildFilterArgsFromView`      | Filter args only (no pagination). Used by entity-specific `buildXxxQuery` that composes filter handlers + `extraArgs`                                          |
| `findFilter(view, field)`      | `view.filters?.find(f => f.field === field)` — sugar                                                                                                          |
| `getStringValues` / `getNumericValues` / `getNumericString` | Coerce DataViews filter values (`string`, `string[]`, `number`, etc.) into REST-safe shapes                            |
| `isInclusionOperator` / `isExclusionOperator` | DataViews operator → REST inclusion/exclusion test                                                                                            |
| `dataview-list-common.scss`    | Shared styles: viewport-fit layout, checkbox visibility, padding, hover, footer, popover, `.sc-list-header`. Also imports `@wordpress/dataviews/build-style/style.css` |

`packages/admin/router/` (used by Settings + every list SPA):

| File         | Purpose                                                  |
| ------------ | -------------------------------------------------------- |
| `index.js`   | `RouterProvider`, `useLocation`, `useHistory`            |
| `useLink.js` | `useLink({ params })` → `{ href, onClick }`              |
| `history.js` | `history` library wrapper with `getLocationWithParams()` |

`packages/admin/hooks/`:

| File                       | Purpose                                                                                                                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useAdminSpaNavigation.js` | Wraps `useLocation`/`useHistory` into a single `navigation` object: `isList`, `isEdit`, `goToList`, `goToCreate`, `goToEdit`, `goToBulkDelete`. `createListEditApp` calls it once and passes the result to children |
| `useListMutation.js`       | `{ isMutating, run }`. `run(operation, { errorMessage })` toggles `isMutating`, runs the op, surfaces a snackbar on throw, and re-raises so DataViews' confirm flow registers the failure                          |
| `useSiteContext.js`        | `{ siteName, siteIconUrl, siteUrl }` — spread into `<StatusSidebar>`                                                                                                                                                  |
| `useModernViewIntroProps.js` | Returns props for `<ModernViewIntroModal>` or `null` if already dismissed                                                                                                                                          |
| `useProductIntegrations.js` | Reference pattern for columns that need a secondary round-trip (integrations per product). Uses `AbortController` + `prevKeyRef`. Copy the shape for any column with its own fetch                                |

`app/src/Controllers/Admin/RendersEnhancedAdminView.php` — PHP trait that owns the dual-render via template method. Children just fill in the two hooks; `index()` picks the branch.

```php
trait RendersEnhancedAdminView {
    // Hooks — child controller implements both.
    abstract protected function renderSpaView();
    abstract protected function renderWpListView();

    // Routing — trait-owned, dispatches on the feature flag.
    public function index();

    // Helpers — used by the child's hook implementations.
    protected function enqueueSpaScripts( string $scriptsController ): void;
    protected function renderSpaShell( string $view, ?string $breadcrumbKey = null, ?string $title = null );
    public function isEnhancedAdminViewsEnabled(): bool;
}
```

List pages never write their own `index()` — they override `renderSpaView()` (enqueue + `renderSpaShell()` with breadcrumb) and `renderWpListView()` (legacy table). For edit/create routes, call `$this->renderSpaShell( $view )` directly (no breadcrumb args) so the React detail view's own breadcrumb isn't duplicated.

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

### 2. Create the list component (slim orchestrator)

`{Entity}List.js` is now a thin orchestrator that wires hooks together and delegates field/action/query construction to the `list/` directory. Reference: `packages/admin/reviews/ReviewsList.js` (simplest) or `packages/admin/products/ProductsList.js` (most complete).

```jsx
/** @jsx jsx */
import { __, _n, sprintf } from '@wordpress/i18n';
import { jsx } from '@emotion/react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useMemo, useCallback } from 'react';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';
import {
	DataViewListLayout,
	useDataViewState,
	StatusSidebar,
	useEnhancedView,
	applyDefaultFieldsExtensions,
	ModernViewIntroModal,
	useTabRefreshKey,
} from '../components/dataview-list';
import useSiteContext from '../hooks/useSiteContext';
import useModernViewIntroProps from '../hooks/useModernViewIntroProps';
import useListMutation from '../hooks/useListMutation';
import ListHeader from '../components/ListHeader';
import { buildEntityFields } from './list/fields';
import { buildEntityActions } from './list/actions';
import {
	buildEntityQuery,
	ENTITY_DEFAULT_SORT,
	ENTITY_SORT_MAP,
} from './list/buildQuery';
import { ENTITY_URL_FILTERS } from './list/urlFilters';
import { useStatusTabs } from './list/useStatusTabs';
import './entity-list-style.scss';

const LAYOUT_STYLES = {
	name: { width: '25%' },
	created: { width: '15%' },
};
const DEFAULT_FIELDS = ['name', 'status', 'created'];
const PREFERENCE_KEY = 'entity-list-view';

// Thin wrapper — useDataViewState calls this with { view }.
const entityQueryArgs = ({ view }) => buildEntityQuery(view);

export default ({ navigation }) => {
	const { deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const { toggle: toggleEnhancedView } = useEnhancedView();
	const siteContext = useSiteContext();
	const introProps = useModernViewIntroProps();
	const { isMutating, run: runMutation } = useListMutation();

	// `applyDefaultFieldsExtensions` lets plugins extend the default visible set.
	const defaultFields = useMemo(
		() => applyDefaultFieldsExtensions('entities', DEFAULT_FIELDS),
		[]
	);

	const {
		view,
		setView,
		records,
		hasResolved,
		paginationInfo,
		invalidateList,
	} = useDataViewState({
		entity: 'entity',
		defaultSort: ENTITY_DEFAULT_SORT,
		sortMap: ENTITY_SORT_MAP,
		defaultFields,
		layoutStyles: LAYOUT_STYLES,
		preferenceKey: PREFERENCE_KEY,
		pageSlug: 'sc-entity',
		urlFilters: ENTITY_URL_FILTERS,
		buildQueryArgs: entityQueryArgs,
	});

	const { refreshKey, bump: bumpTabRefresh } = useTabRefreshKey();
	const { tabs, activeValue, setTab } = useStatusTabs({
		view,
		setView,
		refreshKey,
	});

	const fields = useMemo(
		() => buildEntityFields({ navigation }),
		[navigation]
	);

	const handleDelete = useCallback(
		(items) =>
			runMutation(
				async () => {
					await Promise.all(
						items.map((item) =>
							deleteEntityRecord('surecart', 'entity', item.id, {
								throwOnError: true,
							})
						)
					);
					invalidateList();
					bumpTabRefresh();
					createSuccessNotice(
						sprintf(
							_n(
								'Successfully deleted %d item.',
								'Successfully deleted %d items.',
								items.length,
								'surecart'
							),
							items.length
						),
						{ type: 'snackbar' }
					);
				},
				{ errorMessage: __('Failed to delete.', 'surecart') }
			),
		[runMutation, deleteEntityRecord, createSuccessNotice, invalidateList, bumpTabRefresh]
	);

	const actions = useMemo(
		() => buildEntityActions({ navigation, handleDelete }),
		[navigation, handleDelete]
	);

	return (
		<>
			<DataViewListLayout
				pageHeader={
					<ListHeader
						title={__('Entities', 'surecart')}
						actionLabel={__('Add Entity', 'surecart')}
						actionHref={addQueryArgs('admin.php', {
							page: 'sc-entity',
							action: 'edit',
						})}
						onAction={() => navigation.goToCreate()}
					/>
				}
				statusSidebar={
					<StatusSidebar
						{...siteContext}
						heading={__('Entities', 'surecart')}
						description={__('Manage your entities.', 'surecart')}
						onBack={toggleEnhancedView}
						tabs={tabs}
						activeValue={activeValue}
						onChange={setTab}
					/>
				}
				defaultLayouts={{ table: {} }}
				data={records}
				fields={fields}
				view={view}
				onChangeView={setView}
				paginationInfo={paginationInfo}
				actions={actions}
				isLoading={!hasResolved}
				isMutating={isMutating}
			/>
			{introProps && <ModernViewIntroModal {...introProps} />}
		</>
	);
};
```

Notes:

- `ListHeader` is rendered **inside** `DataViewListLayout` via the `pageHeader` slot, not before it. The layout handles whether to show it inside the workspace card (enhanced view on) or above the table (off).
- `StatusSidebar` is the left rail with site icon + tab list. Skip it for screens with no status concept (e.g. Product Collections — pass no `statusSidebar` prop).
- `useStatusTabs` is per-entity (lives in `list/useStatusTabs.js`); each entity defines its own tab set + count queries. See step 10.
- `useListMutation` wraps every mutation; it surfaces a snackbar on throw and toggles `isMutating` so `DataViewListLayout` can dim the table.
- `useTabRefreshKey` exists so mutations can `bumpTabRefresh()` — `useStatusTabs` re-fetches counts whenever the key changes.
- The `navigation` prop is passed in by `createListEditApp`. Use `navigation.goToEdit(item.id)`, `navigation.goToCreate()`, `navigation.goToBulkDelete(ids)` — never `window.location.href`.

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

Dual-render via the shared trait. The trait owns `index()` — child only implements the two hooks. Copy from `ProductsController.php` or `ProductCollectionsController.php`:

```php
<?php

namespace SureCart\Controllers\Admin\{Entity};

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\RendersEnhancedAdminView;

class {Entity}Controller extends AdminController {
    use RendersEnhancedAdminView;

    // SPA hook — enqueue + render the shell with a breadcrumb.
    protected function renderSpaView() {
        $this->enqueueSpaScripts( {Entity}ScriptsController::class );
        return $this->renderSpaShell(
            'admin/{entity}/spa',
            '{entity}',
            __( '{Entity}s', 'surecart' )
        );
    }

    // Legacy hook — WP_List_Table branch.
    protected function renderWpListView() {
        $table = new {Entity}ListTable();
        $table->prepare_items();

        $this->withHeader( [
            'breadcrumbs' => [
                '{entity}' => [ 'title' => __( '{Entity}s', 'surecart' ) ],
            ],
        ] );

        return \SureCart::view( 'admin/{entity}/index' )->with( [ 'table' => $table ] );
    }

    // Edit/create — bypass the SPA hook so the PHP breadcrumb isn't rendered
    // (the React detail view renders its own).
    public function edit( $request ) {
        $this->enqueueSpaScripts( {Entity}ScriptsController::class );
        // …optional preloadPaths() for the detail view…
        return $this->renderSpaShell( 'admin/{entity}/spa' );
    }
}
```

`{Entity}ScriptsController.php` — extends `AdminModelEditController`. Three fields:

```php
class {Entity}ScriptsController extends AdminModelEditController {
    protected $handle                = 'surecart/scripts/admin/{entity}';
    protected $path                  = 'admin/{entity}';
    protected $needs_dataviews_style = true;  // ← required for the workspace shell
}
```

`$needs_dataviews_style` is read by the parent: it enqueues the dataviews stylesheet **and** injects `enhanced_admin_views_enabled` + `modern_view_intro` into `scData` so `useEnhancedView` / `useModernViewIntroProps` can read them. Without this flag the React app mounts but the workspace shell renders without styles. Copy from `ProductScriptsController.php` for the editor-heavy case (block editor + media); copy from `ReviewsScriptsController.php` for the simple case.

### 8. URL parameter pre-filtering

For deep links like `?status=archived` or `?sc_collection=foo,bar`, declare a `urlFilters` config and pass it to `useDataViewState` along with `pageSlug`. The hook reads the URL on mount and writes back on view change automatically — no `getQueryArgs` boilerplate needed.

```js
const URL_FILTERS = [
	{
		field: 'archive_status', // matches the field id in your fields/filterBy
		urlKey: 'status',         // URL param name
		operator: 'is',
		defaultValue: 'active',   // values matching default are stripped from URL
	},
	{
		field: 'product_collections',
		urlKey: 'sc_collection',
		operator: 'isAny',
		multiple: true,            // comma-joined in URL
	},
];

useDataViewState({
	// ...other options
	pageSlug: 'sc-entity',
	urlFilters: URL_FILTERS,
});
```

Each filter config supports `serialize` / `deserialize` overrides for non-trivial value shapes. Skip `pageSlug` + `urlFilters` entirely for screens with no filters (e.g. Product Collections).

### 9. Build the `list/buildQuery.js` (view → REST args)

Compose filter handlers and any extra args. Each handler mutates an `args` object; the chain runs through `applyFilterHandlerExtensions` so plugins can drop in their own.

```js
// packages/admin/{entity}/list/buildQuery.js
import {
	buildFilterArgsFromView,
	getStringValues,
	findFilter,
} from '../../components/dataview-list/buildBaseQuery';
import { applyFilterHandlerExtensions } from '../../components/dataview-list/applyExtensions';

const SORT_MAP = { name: 'name', created: 'cataloged_at' };
const DEFAULT_SORT = { field: 'created', direction: 'desc' };

export const applyArchiveStatusFilter = ({ view, args }) => {
	const value = findFilter(view, 'archive_status')?.value;
	if (value === 'archived') args.archived = true;
	else if (!value || value === 'active') args.archived = false;
};

const DEFAULT_HANDLERS = [applyArchiveStatusFilter];

const extraArgs = () => ({ expand: ['related_resource'] });

export const buildEntityQuery = (view) => {
	const handlers = applyFilterHandlerExtensions('entities', DEFAULT_HANDLERS, { view });
	return buildFilterArgsFromView({ view, filterHandlers: handlers, extraArgs });
};

export const ENTITY_DEFAULT_SORT = DEFAULT_SORT;
export const ENTITY_SORT_MAP = SORT_MAP;
```

### 10. Build the `list/fields/` directory (one file per column)

Each field module default-exports a factory: `(ctx) => fieldConfig`. The `ctx` carries everything the field needs at runtime (navigation, async elements, integration data, etc.) — keeps fields composable and testable. `list/fields/index.js` calls each factory and runs the result through `applyFieldExtensions` so plugins can inject columns.

```js
// packages/admin/{entity}/list/fields/name.js
/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';

export default ({ navigation } = {}) => ({
	id: 'name',
	label: __('Name', 'surecart'),
	enableSorting: true,
	enableGlobalSearch: true,
	getValue: ({ item }) => item?.name || '',
	render: ({ item }) => (
		<a
			href={`?page=sc-entity&action=edit&id=${item?.id}`}
			onClick={(e) => {
				e.preventDefault();
				navigation?.goToEdit(item?.id);
			}}
			css={css`font-weight: 600;`}
		>
			{item?.name}
		</a>
	),
});

// packages/admin/{entity}/list/fields/archive_status.js
// Filter-only — drives the status tabs; not displayed as a column.
import { __ } from '@wordpress/i18n';

export const ARCHIVE_STATUS_ELEMENTS = [
	{ value: 'active', label: __('Active', 'surecart') },
	{ value: 'archived', label: __('Archived', 'surecart') },
	{ value: 'all', label: __('All', 'surecart') },
];

export default () => ({
	id: 'archive_status',
	label: __('Archive status', 'surecart'),
	enableSorting: false,
	enableHiding: false,
	filterBy: { operators: ['is'] },
	elements: ARCHIVE_STATUS_ELEMENTS,
	render: () => null,
});

// packages/admin/{entity}/list/fields/index.js
import nameField from './name';
import statusField from './status';
import createdField from './created';
import archiveStatusField from './archive_status';
import { applyFieldExtensions } from '../../../components/dataview-list';

export const buildEntityFields = (ctx) => {
	const fields = [
		archiveStatusField(),
		nameField(ctx),
		statusField(ctx),
		createdField(ctx),
	];
	return applyFieldExtensions('entities', fields, ctx);
};
```

Field rules:

-   `enableSorting: true` only for columns in PHP `get_sortable_columns()`
-   `enableGlobalSearch: true` only on the primary search field
-   Column widths via `layoutStyles` passed to `useDataViewState`, **never** CSS `nth-child`
-   Right-align quantitative data; left-align text/dates
-   Use `ProductThumbnail` for any product image cell — do not reinline the SVG placeholder
-   Use `Icon` + `starFilled`/`starEmpty` from `@wordpress/icons` for featured star — do not render raw SVG
-   Filter-only fields (the ones that drive `StatusSidebar` tabs) set `enableHiding: false` and `render: () => null` so they're never shown as a column

### 11. Status sidebar tabs (`list/useStatusTabs.js`)

`StatusSidebar` renders a tablist with counts. Each entity owns its own hook that maps tabs to a DataViews filter and fetches counts in parallel using the REST endpoint's `X-WP-Total` header. Bump `refreshKey` after mutations to refresh counts.

```js
// packages/admin/{entity}/list/useStatusTabs.js
import { useMemo, useEffect, useState, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { Icon, published, archive, post } from '@wordpress/icons';

const TAB_DEFS = [
	{ value: 'active',   label: __('Active', 'surecart'),   archived: false, icon: <Icon icon={published} size={18} /> },
	{ value: 'archived', label: __('Archived', 'surecart'), archived: true,  icon: <Icon icon={archive}   size={18} /> },
	{ value: 'all',      label: __('All', 'surecart'),                       icon: <Icon icon={post}      size={18} /> },
];

export const useStatusTabs = ({ view, setView, refreshKey = 0 }) => {
	const activeValue =
		view?.filters?.find((f) => f.field === 'archive_status')?.value || 'active';

	const setTab = (value) =>
		setView((prev) => ({
			...prev,
			page: 1,
			filters: [
				...(prev.filters || []).filter((f) => f.field !== 'archive_status'),
				{ field: 'archive_status', operator: 'is', value },
			],
		}));

	const [counts, setCounts] = useState({});
	const reqIdRef = useRef(0);

	useEffect(() => {
		const id = ++reqIdRef.current;
		const queries = TAB_DEFS.map((tab) => {
			const params = { per_page: 1, page: 1 };
			if (tab.archived !== undefined) params.archived = tab.archived;
			return apiFetch({
				path: addQueryArgs('/surecart/v1/entities', params),
				parse: false,
			})
				.then((res) => ({ value: tab.value, count: parseInt(res.headers.get('X-WP-Total') || '0', 10) }))
				.catch(() => ({ value: tab.value, count: undefined }));
		});
		Promise.all(queries).then((entries) => {
			if (id !== reqIdRef.current) return;
			const next = {};
			for (const e of entries) if (typeof e.count === 'number') next[e.value] = e.count;
			setCounts(next);
		});
	}, [refreshKey]);

	const tabs = useMemo(
		() => TAB_DEFS.map((t) => ({ value: t.value, label: t.label, icon: t.icon, count: counts[t.value] })),
		[counts]
	);
	return { tabs, activeValue, setTab };
};
```

For DataViews-style facets that aren't a tab strip (per-taxonomy dropdowns, collection multi-select), keep them on the field as `filterBy: { operators: [...] }` + `elements: [...]`. DataViews handles the chip UI, persistence, i18n, and accessibility. Don't build custom `TabPanel`s or native `<select>`s on the page chrome.

### 12. Build the `list/actions/` directory

Mirror the fields pattern: a builder factory + `applyActionExtensions`. The same `ConfirmActionModal` handles both single-row and bulk variants — it takes an `items` array; the row action passes `[item]`, bulk passes the whole selection.

```js
// packages/admin/{entity}/list/actions/index.js
import { useEffect } from 'react';
import { __, _n, sprintf } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';
import { trash, edit, external } from '@wordpress/icons';
import {
	ConfirmActionModal,
	applyActionExtensions,
	iconLabel,
} from '../../../components/dataview-list';

// Bulk delete bridge — DataViews only gives us `RenderModal`, so a 0-paint
// component dismisses the modal and routes the SPA to the bulk-delete view.
const NavigateToBulkDelete = ({ items, closeModal, navigation }) => {
	useEffect(() => {
		closeModal();
		navigation.goToBulkDelete(items.map((i) => i.id));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return null;
};

export const buildEntityActions = ({ navigation, handleDelete }) => {
	const actions = [
		{
			id: 'edit',
			label: iconLabel(<Icon icon={edit} />, __('Edit', 'surecart')),
			icon: <Icon icon={edit} />,
			isPrimary: true,
			callback: ([item]) => navigation.goToEdit(item.id),
		},
		{
			id: 'view',
			label: iconLabel(<Icon icon={external} />, __('View', 'surecart')),
			icon: <Icon icon={external} />,
			isPrimary: true,
			isEligible: (item) => !!item.permalink,
			callback: ([item]) => window.open(item.permalink, '_blank'),
		},
		{
			id: 'delete',
			label: __('Delete permanently', 'surecart'),
			icon: <Icon icon={trash} />,
			supportsBulk: true,
			RenderModal: ({ items, closeModal }) => {
				// Bulk → SPA bulk-delete route (Action Scheduler pipeline).
				// Single → inline confirm modal.
				if (items.length > 1) {
					return (
						<NavigateToBulkDelete
							items={items}
							closeModal={closeModal}
							navigation={navigation}
						/>
					);
				}
				return (
					<ConfirmActionModal
						items={items}
						closeModal={closeModal}
						onConfirm={handleDelete}
						confirmLabel={__('Delete', 'surecart')}
						isDestructive
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
				);
			},
		},
	];
	return applyActionExtensions('entities', actions, { navigation });
};
```

After any mutation, **call `invalidateList()`** (and `bumpTabRefresh()` if the screen has status tabs) — `saveEntityRecord` / `deleteEntityRecord` / `apiFetch` do not refresh the list query or the tab counts on their own.

### 13. Bulk mutation patterns

Four patterns; pick by use case. Bulk delete and bulk PATCH default to the Batch API; the routed PHP+Action-Scheduler path is reserved for entities that need a dedicated confirm view.

1. **Batch API (default for bulk anything — delete, archive, status changes)** — one `POST /surecart/v1/batches` request carries N `DELETE` or `PATCH` operations. The upstream platform processes them asynchronously and returns once the queue is accepted, so the success notice reads "Queued %d items …. Refresh in a moment …" and `invalidateList()` refreshes the table once the upstream completes.

   Single-row mutations should NOT use the Batch API — keep `deleteEntityRecord` / `saveEntityRecord` so core-data drops/updates the row in the cache instantly. Branch on `items.length`:

   ```js
   if (items.length === 1) {
     await deleteEntityRecord('surecart', 'entity', items[0].id, { throwOnError: true });
     // ...invalidate + success notice
     return;
   }
   await apiFetch({
     path: '/surecart/v1/batches',
     method: 'POST',
     data: {
       batch_operations: items.map((item) => ({
         http_method: 'DELETE',
         path: `/v1/entity_endpoint/${item.id}`,
       })),
     },
   });
   ```

   Canonical examples: `ProductsList.handleArchiveToggle` (PATCH), `ReviewsList.handleDelete` / `ProductGroupsList.handleDelete` / `ProductCollectionsList.handleDelete` (DELETE). The path inside `batch_operations` uses the upstream endpoint slug (snake_case — `product_collections`, `product_groups`, `reviews`), not the core-data entity name.

2. **Routed bulk delete (Products only — for entities with truly large lists)** — `NavigateToBulkDelete` bridges the DataViews modal to `navigation.goToBulkDelete(ids)`, which routes the SPA to the PHP `confirmBulkDelete` view. The receiving controller submits to `bulkDelete` which uses Action Scheduler. This is overkill for small entities — use it only when the list can grow into the thousands. The legacy `confirmBulkDelete` / `bulkDelete` PHP methods + their routes stay wired until the legacy table is removed.

3. **Sequential `for…of` (mutations that hit per-resource locks)** — when the upstream API rejects parallel writes to the same kind of resource. The canonical example is `ReviewsList.mutateStatus`: approve/reject one review at a time, primed into the core-data cache after each PATCH so the row's status badge updates immediately. Comment in the code: "Sequential, not Promise.all — platform per-resource locks reject parallel writes."

4. **`Promise.allSettled` partial-success (mutations the platform doesn't queue for you)** — when you need per-item success/failure reporting and the operation isn't suited to the Batch API. Fan out N requests, then branch on `succeeded`/`failed` counts:
   - all-success → `createSuccessNotice`
   - partial → `createErrorNotice` ("Did X, failed Y")
   - all-fail → `throw` so `useListMutation` surfaces the snackbar
   - **Always invalidate**, in all three branches. `Promise.all` would short-circuit on the first rejection and leave successfully-mutated rows looking stale. Canonical example: `ProductsList.handleDuplicate` (no Batch API equivalent because each duplicate call returns the new product ID that the user might want to track).

### 14. SCSS

```scss
// packages/admin/{entity}/{entity}-list-style.scss
@import '../components/dataview-list/dataview-list-common.scss';
// Entity-specific overrides only if needed (usually none).
```

The shared SCSS provides viewport-fit layout, checkbox visibility, padding, hover, footer, popover constraints, the workspace shell, and the `.sc-list-header` rules used by `ListHeader`. The vendor CSS (`@wordpress/dataviews/build-style/style.css`) is imported by `dataview-list-common.scss` — it ships with the bundle that uses the components. Do not import it again.

## useDataViewState API

```js
const {
	view,
	setView,           // standard DataViews onChange — pass to <DataViewListLayout>
	records,
	hasResolved,
	paginationInfo,
	invalidateList,    // call after mutations
	queryArgs,         // for debugging
} = useDataViewState({
	entity: 'product',
	kind: 'surecart',                                     // default
	defaultSort: { field: 'created_at', direction: 'desc' },
	sortMap: { name: 'name', created_at: 'cataloged_at' }, // optional — view field → API field
	defaultFields: ['name', 'price', 'created_at'],
	perPage: 20,
	layoutStyles: { name: { width: '25%' } },
	preferenceKey: 'products-list-view',                  // persists layout subset (see below)
	pageSlug: 'sc-products',                              // required for URL filter sync
	urlFilters: PRODUCTS_URL_FILTERS,                     // see step 8
	buildQueryArgs: ({ view }) => buildEntityQuery(view), // thin wrapper around the list/buildQuery.js builder
});
```

**Persistence contract** — preferences scope `surecart/dataview-lists`, key `preferenceKey`. Persists only the layout subset:

| Persisted (preferences) | Transient (URL or session) |
| --- | --- |
| `fields` (visible columns) | `filters` (URL when `urlFilters` provided) |
| `layout`                   | `search` (session only) |
| `perPage`                  | `page` (session only) |
| `sort`                     | |

Layout `type` is **not** persisted because `DataViewListLayout` declares `supportedLayouts={['table']}` — table is the only layout. Filters live in the URL — they're shareable, refresh-safe, and can't drift from what the user sees. Search and page are intentionally not persisted; they reset on reload.

## DataViewListLayout Props

```jsx
<DataViewListLayout
    pageHeader={<ListHeader title={…} actionLabel={…} onAction={…} />}
    statusSidebar={<StatusSidebar … />}    // optional — pass to enable workspace shell
    header={<Button>Export</Button>}        // optional — rendered next to gear icon in the table header
    defaultLayouts={{ table: {} }}          // required — without this DataViews defaults to all layouts
    data={records}
    fields={fields}
    view={view}
    onChangeView={setView}
    paginationInfo={paginationInfo}
    actions={actions}
    isLoading={!hasResolved}
    isMutating={isMutating}                 // dims the table with a spinner overlay
    enhancedViewControl={true}              // shows the workspace toggle in the header (default true)
/>
```

Two render modes, picked automatically:

- **Workspace shell** — when `statusSidebar` is passed **and** `useEnhancedView` is on **and** viewport ≥ `medium`. Renders inside `InterfaceSkeleton` with a dark frame and a rounded white canvas (mirroring `@wordpress/edit-site`).
- **Inline** — everywhere else. `pageHeader` renders above the table, no sidebar.

`<Notifications />` is mounted by the layout in both modes — don't render it yourself.

## Common Pitfalls

1. **Don't use `filterSortAndPaginate`** with server-side data — re-paginates client-side
2. **Don't use `table-layout: fixed`** — text overlap. Use `layoutStyles` for column widths
3. **Don't use CSS `nth-child` for column widths** — fragile; use `layoutStyles`
4. **Don't set `titleField`** unless you want a duplicate combined primary column
5. **Use `@emotion/react`** (not `@emotion/core`) for the css prop
6. **Text domain must be `'surecart'`** — bare i18n strings stored in data structures aren't extracted; call `__()` / `_n()` with literal arguments at the call site
7. **Use `range_display_amount`** for price display
8. **Use `useAsyncEntityElements` / `useProductElements`** for async-fetched filter options — not native `<select>`, not custom `useEffect` boilerplate
9. **Always check `hasResolved`** (or `isLoading={!hasResolved}`) before rendering
10. **`StatusSidebar` is the canonical status tab UI** — express status filters via the entity's `useStatusTabs` hook + `archive_status` (or equivalent) filter-only field. No custom `TabPanel`s, no separate strips
11. **Settings popover is a portal** — `.dataviews-view-config` renders at body level. Width constraints belong at global scope in `dataview-list-common.scss`
12. **Always call `invalidateList()` after mutations** — and `bumpTabRefresh()` if the screen has status tabs. `saveEntityRecord` / `deleteEntityRecord` / `apiFetch` don't refresh the list or tab counts on their own
13. **URL filter sync is owned by `useDataViewState`** — declare `urlFilters` + `pageSlug` and let the hook handle URL parse/write. Don't read `window.location.search` or `getQueryArgs(...)` in the component
14. **Use `navigation.goToEdit(id)` / `goToCreate()` / `goToBulkDelete(ids)` for navigation** — not `window.location.href`
15. **`spa.php` has no `<h1>` or "Add New" button** — `ListHeader` (inside `DataViewListLayout`'s `pageHeader` slot) renders them. Don't port the legacy page header into the spa view
16. **One `handleDelete` for single + bulk** — `ConfirmActionModal` takes `items`; the row action wraps one item in an array. Don't branch into two code paths. Exception: large bulk delete → use the `NavigateToBulkDelete` bridge to the SPA bulk-delete route
17. **`useAdminSpaNavigation` is consumed by `createListEditApp`** — don't call it again in the list/edit component; read the `navigation` prop that the factory passes in
18. **Don't touch DOM outside the app root** — `createListEditApp` deliberately doesn't sync sidebars, menu items, or external headers. Toolbar controls go inside `DataViewListLayout` via `header` (next to the gear icon) or as a DataViews `action`
19. **Each page is its own webpack entry, PHP controller, view, and React root** — there is no shared shell or page registry. Keep the file layout strictly per-entity
20. **Bulk delete/PATCH go through the Batch API; never `Promise.all` from the browser** — `Promise.all` short-circuits on the first rejection and leaves rows stale, and N parallel direct calls hammer the upstream rate limit. One `POST /surecart/v1/batches` carries all operations. Single-row mutations still go through `deleteEntityRecord` / `saveEntityRecord` for the optimistic cache update; branch on `items.length`. Reserve `Promise.allSettled` for cases the Batch API can't express (e.g. duplicate, which returns per-item new IDs)
21. **`defaultLayouts={{ table: {} }}` is required on `DataViewListLayout`** — without it DataViews falls back to its built-in all-layouts default and renders selector controls for grid/list that nothing else supports
22. **`useListMutation`'s `run()` re-throws** — that's intentional so DataViews' confirm flow registers the failure and re-opens the modal. Don't swallow it
23. **`$needs_dataviews_style = true` in the entity's `ScriptsController`** — the parent `AdminModelEditController` reads this flag to enqueue the dataviews stylesheet + provide `enhanced_admin_views_enabled` / `modern_view_intro` to `scData`. Skip it and the workspace shell will render without styles

## Quick Migration Template

To migrate Orders:

1. **`packages/admin/orders/list/buildQuery.js`** — `buildOrdersQuery(view)`, filter handlers, `ORDERS_DEFAULT_SORT`, `ORDERS_SORT_MAP`
2. **`packages/admin/orders/list/urlFilters.js`** — `ORDERS_URL_FILTERS` (field ↔ URL key map)
3. **`packages/admin/orders/list/useStatusTabs.js`** — tab defs + count fetcher (skip if no status concept)
4. **`packages/admin/orders/list/fields/{name,status,total,created,…}.js`** — one factory per column
5. **`packages/admin/orders/list/fields/index.js`** — `buildOrderFields(ctx)` + `applyFieldExtensions('orders', …)`
6. **`packages/admin/orders/list/actions/index.js`** — `buildOrderActions({ navigation, handleDelete, … })` + `applyActionExtensions('orders', …)`
7. **`packages/admin/orders/OrdersList.js`** — slim orchestrator (copy `ReviewsList.js` shape; ~100–250 lines depending on bulk operations)
8. **`packages/admin/orders/OrdersApp.js`** — `createListEditApp({ pageSlug: 'sc-orders', ListComponent: OrdersList, loadEditComponent: () => import('./Order') })`
9. **`packages/admin/orders/index.js`** — mount `<OrdersApp />` on `#sc-orders-app`
10. **`packages/admin/orders/orders-list-style.scss`** — `@import '../components/dataview-list/dataview-list-common.scss';`
11. **`webpack.config.js`** — add `['admin/orders']: 'packages/admin/orders/index.js'`
12. **`views/admin/orders/spa.php`** — two lines: flash messages + `<div id="sc-orders-app">`
13. **`app/src/Controllers/Admin/Orders/OrdersController.php`** — `use RendersEnhancedAdminView;`, dual-render via `isEnhancedAdminViewsEnabled()`
14. **`app/src/Controllers/Admin/Orders/OrdersScriptsController.php`** — `$handle = 'surecart/scripts/admin/orders'`, `$path = 'admin/orders'`, `$needs_dataviews_style = true`

That's it.
