# PHP List Table to WP DataView Migrator

This skill documents the pattern for migrating SureCart's PHP `WP_List_Table`-based admin pages to React-based `@wordpress/dataviews` components, based on the established product list implementation.

## Architecture Overview

SureCart currently uses PHP `WP_List_Table` subclasses for admin list pages (Products, Coupons, Orders, etc.). The migration replaces the server-rendered HTML table with a client-side React `<DataViews>` component that:

-   Fetches data via the existing SureCart REST API (`/surecart/v1/{endpoint}`)
-   Uses WordPress Core Data store (`@wordpress/core-data`) with registered entities
-   Supports server-side pagination, sorting, filtering, and search
-   Provides bulk actions with confirmation modals
-   Integrates with SureCart admin UI patterns (sc-\* components, Emotion CSS, ModelSelector)

## Reference Implementations

-   **Products list** (primary reference): `packages/admin/products/ProductsList.js`
-   **Currencies DataView**: `packages/admin/settings/display-currency/components/DisplayCurrenciesSettings.js`

Study the products list before starting any migration — it has the most complete pattern.

## File Structure

Each DataView migration produces these files:

```
packages/admin/{entity}/
  ├── {entity}-list-root.js      # React entry point (mounts to DOM)
  ├── {Entity}List.js             # Main DataView component
  └── {entity}-list-style.scss    # Styles (imports DataViews base CSS)

views/admin/{entity}/
  └── index.php                   # PHP view with mount div

app/src/Controllers/Admin/{Entity}/
  └── {Entity}ListScriptsController.php  # Enqueues JS + CSS

webpack.config.js                 # Entry point registration
```

## Migration Checklist

### 1. Verify Entity Registration

Check `packages/admin/store/add-entities.js` for the entity. It should have:

```js
{
  name: 'product',           // entity name
  kind: 'surecart',          // always 'surecart'
  label: __('Product', 'surecart'),
  baseURL: '/surecart/v1/products',
  baseURLParams: { context: 'edit' },
  supportsPagination: true,  // REQUIRED for server-side pagination
}
```

If `supportsPagination` is missing, add it. Without it, `useEntityRecords` won't return `totalItems`/`totalPages`.

### 2. Create the Entry Point

Create a separate entry file (NOT the edit page's `index.js`):

```js
// packages/admin/{entity}/{entity}-list-root.js
import { createRoot } from '@wordpress/element';
import EntityList from './EntityList';
import '../store/add-entities';

const container = document.getElementById('sc-{entity}-list-app');
if (container) {
	const root = createRoot(container);
	root.render(<EntityList />);
}
```

**Important:** The mount ID must be `sc-{entity}-list-app` (NOT `app` — that's used by the edit page). Register in `webpack.config.js`:

```js
['admin/{entity}-list']: path.resolve(process.cwd(), 'packages/admin/{entity}/{entity}-list-root.js'),
```

### 3. Map PHP Columns to DataView Fields

For each column in the PHP `get_columns()` method, create a field definition:

```js
const fields = useMemo(
	() => [
		{
			id: 'name',
			label: __('Name', 'surecart'),
			enableSorting: true,
			enableGlobalSearch: true,
			render: ({ item }) => (
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 12px;
					`}
				>
					{/* Image thumbnail */}
					{item?.featured_product_media?.media?.url ? (
						<img
							src={item.featured_product_media.media.url}
							alt={item?.name}
							css={css`
								width: 40px;
								height: 40px;
								object-fit: cover;
								border-radius: var(--sc-border-radius-medium);
							`}
						/>
					) : (
						<div
							css={css`
								width: 40px;
								height: 40px;
								background: #f3f3f3; /* placeholder */
							`}
						/>
					)}
					<a
						href={getEditUrl(item?.id)}
						css={css`
							font-weight: 600;
							color: var(--sc-color-gray-900);
							text-decoration: none;
							&:hover {
								color: var(--sc-color-primary-500);
							}
						`}
					>
						{item?.name}
					</a>
				</div>
			),
		},
		{
			id: 'price',
			label: __('Price', 'surecart'),
			enableSorting: false,
			render: ({ item }) => item?.range_display_amount || '-',
			// NOTE: Use range_display_amount for pre-formatted price strings.
			// Do NOT use metrics.min_price_amount_display (does not exist in API response).
		},
		{
			id: 'date',
			label: __('Created', 'surecart'),
			enableSorting: true,
			render: ({ item }) => {
				if (!item?.cataloged_at) return '-';
				return new Date(item.cataloged_at * 1000).toLocaleDateString(
					undefined,
					{
						year: 'numeric',
						month: 'short',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
					}
				);
			},
		},
	],
	[]
);
```

**Field mapping rules:**

-   `enableSorting: true` only for columns that exist in the PHP `get_sortable_columns()`
-   `enableGlobalSearch: true` only for the primary search field
-   Use `render` for custom cell content (images, tags, links, icons)
-   For price display, use `item.range_display_amount` — it returns pre-formatted strings like "$50 - $70"

### 4. Map PHP Sorting to API Sort Parameter

The SureCart API uses `sort=field:direction` format. Map from the PHP `get_sort_map()`:

```js
const SORT_MAP = {
	name: 'name',
	date: 'cataloged_at',
};

const queryArgs = useMemo(() => {
	const sortField = view.sort?.field
		? SORT_MAP[view.sort.field] || view.sort.field
		: 'cataloged_at';
	const sortDir = view.sort?.direction || 'desc';
	return {
		per_page: view.perPage,
		page: view.page,
		sort: `${sortField}:${sortDir}`,
		query: view.search || undefined,
	};
}, [view]);
```

### 5. Map PHP Tabs to WordPress-Style Text Links

If the PHP list table has `get_views()` returning status tabs (e.g., Active/Archived/All), implement as WordPress-style text link tabs — **NOT** a button group or `TabPanel`:

```jsx
const STATUS_TABS = [
	{ value: 'active', label: __('Active', 'surecart') },
	{ value: 'archived', label: __('Archived', 'surecart') },
	{ value: 'all', label: __('All', 'surecart') },
];

// In render:
<ul
	css={css`
		display: flex;
		gap: 0;
		margin: 0;
		padding: 0;
		list-style: none;
		border-bottom: 1px solid #c3c4c7;
	`}
>
	{STATUS_TABS.map((tab) => (
		<li
			key={tab.value}
			css={css`
				margin: 0 0 -1px 0;
			`}
		>
			<a
				href={`#${tab.value}`}
				onClick={(e) => {
					e.preventDefault();
					setStatus(tab.value);
					setView((prev) => ({ ...prev, page: 1 }));
				}}
				css={css`
					display: inline-block;
					padding: 6px 12px;
					text-decoration: none;
					font-size: 14px;
					font-weight: ${status === tab.value ? '600' : '400'};
					color: ${status === tab.value ? '#1d2327' : '#646970'};
					border-bottom: ${status === tab.value
						? '2px solid #1d2327'
						: '2px solid transparent'};
					&:hover {
						color: #1d2327;
					}
				`}
			>
				{tab.label}
			</a>
		</li>
	))}
</ul>;
```

Add `margin-top: 12px` on the tabs+filter wrapper for spacing from the page title.

### 6. Map PHP Dropdown Filters to ModelSelector

If the PHP table has `extra_tablenav()` with dropdowns (e.g., `product_collection_dropdown()`), use the `ModelSelector` component — **NOT** a native `<select>`. This gives you search, infinite scroll pagination, and consistent UI:

```jsx
import ModelSelector from '../components/ModelSelector';
import { ScMenuItem, ScDivider } from '@surecart/components-react';

// Filter state
const [collectionId, setCollectionId] = useState('');

// In query args:
product_collection_ids: collectionId ? [collectionId] : undefined,
	(
		// In render:
		<div
			css={css`
				min-width: 240px;
			`}
		>
			<ModelSelector
				name="product-collection"
				placeholder={__('All Product Collections', 'surecart')}
				searchPlaceholder={__('Search collections…', 'surecart')}
				value={collectionId}
				onSelect={(id) => {
					setCollectionId(id === collectionId ? '' : id);
					setView((prev) => ({ ...prev, page: 1 }));
				}}
				style={{ width: '100%' }}
				prefix={
					collectionId ? (
						<>
							<ScMenuItem
								onClick={() => {
									setCollectionId('');
									setView((prev) => ({ ...prev, page: 1 }));
								}}
							>
								{__('All Product Collections', 'surecart')}
							</ScMenuItem>
							<ScDivider
								style={{
									'--spacing': 'var(--sc-spacing-x-small)',
								}}
							/>
						</>
					) : null
				}
			/>
		</div>
	);
```

**Key details:**

-   `ModelSelector` wraps `ScSelect` with built-in search (750ms debounce), pagination (infinite scroll on `onScScrollEnd`), and pinned selected item
-   The `prefix` prop adds an "All" reset option at the top of the dropdown when a filter is active
-   Toggle logic: clicking the same value again clears the filter

### 7. Map PHP Row Actions to DataView Actions

Map each action from `getRowActions()` / `row_actions()`:

```js
const actions = useMemo(
	() => [
		{
			id: 'edit',
			label: __('Edit', 'surecart'),
			icon: <Icon icon={edit} />,
			callback: ([item]) => {
				window.location.href = getEditUrl(item.id);
			},
		},
		{
			id: 'archive',
			label: __('Archive', 'surecart'),
			icon: <Icon icon={archive} />,
			isEligible: (item) => !item.archived,
			supportsBulk: true,
			callback: (items) => handleArchiveToggle(items),
		},
		{
			id: 'delete',
			label: __('Delete permanently', 'surecart'),
			icon: <Icon icon={trash} />,
			isDestructive: true,
			supportsBulk: true,
			hideModalHeader: true,
			RenderModal: ({ items, closeModal }) => (
				<VStack>
					<Text>
						{sprintf(
							_n(
								'Delete %d item?',
								'Delete %d items?',
								items.length,
								'surecart'
							),
							items.length
						)}
					</Text>
					<HStack justify="end">
						<Button variant="tertiary" onClick={closeModal}>
							{__('Cancel', 'surecart')}
						</Button>
						<Button
							variant="primary"
							isDestructive
							onClick={() => {
								handleDelete(items);
								closeModal();
							}}
						>
							{__('Delete', 'surecart')}
						</Button>
					</HStack>
				</VStack>
			),
		},
	],
	[handleArchiveToggle, handleDelete]
);
```

### 8. DataView Component Structure

```jsx
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { DataViews } from '@wordpress/dataviews/wp';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { useMemo, useState, useCallback } from 'react';
import {
	Button,
	__experimentalText as Text,
	__experimentalVStack as VStack,
	__experimentalHStack as HStack,
	Icon,
} from '@wordpress/components';
import { trash, copy, archive, edit, external } from '@wordpress/icons';
import ModelSelector from '../components/ModelSelector';
import { ScMenuItem, ScDivider } from '@surecart/components-react';
import './entity-list-style.scss';

export default function EntityList() {
	const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const [status, setStatus] = useState('active');
	const [filterId, setFilterId] = useState('');

	const [view, setView] = useState({
		type: 'table',
		perPage: 20,
		page: 1,
		sort: { field: 'date', direction: 'desc' },
		search: '',
		filters: [],
		layout: { primaryField: 'name' },
		fields: ['name', 'price', 'date'], // visible field IDs
	});

	const queryArgs = useMemo(
		() => ({
			/* ... */
		}),
		[view, status, filterId]
	);

	const { records, hasResolved, totalItems, totalPages } = useEntityRecords(
		'surecart',
		'entity',
		queryArgs
	);

	const paginationInfo = useMemo(
		() => ({ totalItems, totalPages }),
		[totalItems, totalPages]
	);

	const fields = useMemo(
		() => [
			/* ... */
		],
		[]
	);
	const actions = useMemo(
		() => [
			/* ... */
		],
		[]
	);

	return (
		<div className="sc-entity-dataview-wrapper">
			{/* Status Tabs + Filter */}
			<div
				css={css`
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 16px;
					margin-top: 12px;
					margin-bottom: 16px;
					flex-wrap: wrap;
				`}
			>
				<ul>{/* WordPress-style text link tabs */}</ul>
				<div
					css={css`
						min-width: 240px;
					`}
				>
					<ModelSelector name="related-entity" /* ... */ />
				</div>
			</div>

			{/* DataView Table Card */}
			<div
				css={css`
					background: var(
						--sc-card-background-color,
						var(--sc-color-white)
					);
					border: 1px solid var(--sc-card-border-color, var(--sc-color-gray-300));
					border-radius: var(--sc-input-border-radius-medium);
					box-shadow: var(--sc-shadow-small);
				`}
			>
				<DataViews
					data={records || []}
					fields={fields}
					view={view}
					onChangeView={setView}
					paginationInfo={paginationInfo}
					supportedLayouts={['table']}
					defaultLayouts={{
						table: { layout: { primaryField: 'name' } },
					}}
					isLoading={!hasResolved}
					actions={actions}
					hasBulkActions={true}
				/>
			</div>
		</div>
	);
}
```

### 9. SCSS Styles

Create a SCSS file with the DataViews base import and SureCart customizations. Wrap all custom rules in a `.sc-{entity}-dataview-wrapper` class:

```scss
@import "@wordpress/dataviews/build-style/style.css";

$padding-size: 20px;

// ─── Checkbox visibility: hide on rows, show on hover/check ───
.sc-{entity}-dataview-wrapper {
  .dataviews-view-table {
    tr td .components-checkbox-control__input-container {
      opacity: 0;
      transition: opacity 0.1s ease;
    }
    tr:hover td .components-checkbox-control__input-container,
    tr:focus-within td .components-checkbox-control__input-container,
    tr td .components-checkbox-control__input-container:has(input:checked),
    tr td .components-checkbox-control__input-container:has(input:indeterminate) {
      opacity: 1;
    }
    thead th .components-checkbox-control__input-container {
      opacity: 1;  // header checkbox always visible
    }
  }
  @media (hover: none) {
    .dataviews-view-table tr td .components-checkbox-control__input-container {
      opacity: 1;  // touch devices: always show
    }
  }
}

// ─── Table full-width + padding ───
.sc-{entity}-dataview-wrapper {
  .dataviews-view-table {
    width: 100%;
    tr {
      td, th {
        &:first-child { padding-left: $padding-size; }
        &:last-child { padding-right: $padding-size; }
      }
    }
  }
  .dataviews-view-table-wrapper { width: 100%; }
}

// ─── Search, footer, filter padding ───
.sc-{entity}-dataview-wrapper {
  .dataviews__view-actions, .dataviews-footer, .dataviews-filters__container {
    padding-left: $padding-size;
    padding-right: $padding-size;
  }
}

// ─── Hover row color ───
.sc-{entity}-dataview-wrapper {
  .dataviews-wrapper {
    --wp-components-color-gray-100: var(--sc-color-brand-main-background);
  }
  .dataviews-view-table tr.is-hovered {
    background-color: var(--sc-color-brand-main-background);
  }
}

// ─── Settings popover: constrain width ───
.sc-{entity}-dataview-wrapper {
  .dataviews-view-config { width: 320px; max-width: 320px; }
}

// ─── Footer alignment ───
.sc-{entity}-dataview-wrapper {
  .dataviews-footer {
    display: flex; align-items: center; justify-content: space-between; min-height: 48px;
  }
  .dataviews-bulk-actions-footer__container {
    display: flex; align-items: center; gap: 12px;
  }
}

// ─── Primary column width hint ───
.sc-{entity}-dataview-wrapper {
  .dataviews-view-table th:nth-child(2),
  .dataviews-view-table td:nth-child(2) {
    width: 25%;  // Name column (2nd after checkbox column)
  }
}
```

### 10. PHP Controller — CSS Enqueuing (CRITICAL)

The `AdminModelEditController` base class only enqueues JS files — **it does NOT enqueue CSS**. You must explicitly enqueue both CSS files in your scripts controller:

```php
class EntityListScriptsController extends AdminModelEditController {
  protected $with_data = ['currency', 'links'];
  protected $handle = 'surecart/scripts/admin/{entity}-list';
  protected $path = 'admin/{entity}-list';

  public function __construct() {
    $this->data['api_url'] = \SureCart::requests()->getBaseUrl();
  }

  /**
   * Override to enqueue CSS explicitly and skip heavy editor deps.
   */
  public function enqueueScriptDependencies() {
    wp_enqueue_style('wp-components');

    $dist_url  = trailingslashit(\SureCart::core()->assets()->getUrl()) . 'dist/';
    $dist_path = plugin_dir_path(SURECART_PLUGIN_FILE) . 'dist/';

    // Custom styles (products-list.css from SCSS)
    $base_css = $this->path . '.css';
    if (file_exists($dist_path . $base_css)) {
      wp_enqueue_style($this->handle . '-base', $dist_url . $base_css, ['wp-components'], filemtime($dist_path . $base_css));
    }

    // Vendor styles (style-products-list.css from @import of DataViews CSS)
    $style_css = 'admin/style-' . basename($this->path) . '.css';
    if (file_exists($dist_path . $style_css)) {
      wp_enqueue_style($this->handle . '-vendor', $dist_url . $style_css, ['wp-components'], filemtime($dist_path . $style_css));
    }
  }
}
```

**Why this matters:** Webpack produces two CSS files from the SCSS:

-   `{entity}-list.css` — your custom SCSS rules
-   `style-{entity}-list.css` — extracted vendor CSS from `@import` (DataViews base styles)

Both must be enqueued or the table will render unstyled.

### 11. PHP View Template

Replace the legacy list table view with the DataView mount point directly — no conditional needed:

```php
<!-- views/admin/{entity}/index.php -->
<div class="wrap">
  <?php
  \SureCart::render(
    'layouts/partials/admin-index-header',
    [
      'title'    => __( '{Entity}s', 'surecart' ),
      'new_link' => \SureCart::getUrl()->edit( '{entity}' ),
    ]
  );
  ?>

  <div id="sc-{entity}-list-app"></div>
</div>
```

The controller should return the view without any extra parameters:

```php
return \SureCart::view( 'admin/{entity}/index' );
```

### 12. Server-Side Pagination Notes

-   The SureCart API returns pagination in: `{ data: [...], pagination: { count, limit, page } }`
-   `useEntityRecords` with `supportsPagination: true` maps this to `totalItems` and `totalPages`
-   Always pass `per_page` and `page` in query args
-   The `filterSortAndPaginate` utility from `@wordpress/dataviews/wp` is for **CLIENT-SIDE** filtering — do NOT use it for server-side paginated data. Pass `records` directly to `data` prop.

## Common Pitfalls

1. **Don't use `filterSortAndPaginate`** with server-side data — it re-paginates client-side and breaks totals
2. **CSS won't load automatically** — `AdminModelEditController` only enqueues JS. You must override `enqueueScriptDependencies()` to enqueue both CSS files
3. **Don't use `table-layout: fixed`** — it forces equal column widths and causes text overlap. Use `width: 100%` on the table with column width hints via `nth-child` selectors
4. **Mount ID must be unique** — use `sc-{entity}-list-app`, not `app` (which is the edit page's mount)
5. **Entry file must be separate** — create `{entity}-list-root.js`, don't reuse the edit page's `index.js`
6. **Use `@emotion/react`** (not `@emotion/core`) for the css prop — SureCart admin uses the React flavor
7. **Text domain must be `'surecart'`**
8. **Use `range_display_amount`** for price display — `metrics.min_price_amount_display` does not exist in API responses
9. **Entity expand params** — if you need related data (prices, collections), add them to query args or entity `baseURLParams`
10. **Use `ModelSelector`** for filter dropdowns, not native `<select>` — ensures consistent UI with search and pagination
11. **Always check `hasResolved`** before rendering data-dependent UI
12. **Tabs must be WP-style text links** (`<ul>/<li>/<a>`) with underline active indicator — not button groups or `TabPanel`
