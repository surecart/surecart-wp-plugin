# PHP List Table to WP DataView Migrator

This skill documents the pattern for migrating SureCart's PHP `WP_List_Table`-based admin pages to React-based `@wordpress/dataviews` components, using a **reusable component library** and the **unified SPA shell** established by the product list migration.

## Architecture Overview

SureCart has ~20 PHP `WP_List_Table` subclasses for admin list pages (Products, Coupons, Orders, Subscriptions, etc.). The migration replaces server-rendered HTML tables with client-side React `<DataViews>` components that:

- Fetch data via SureCart REST API (`/surecart/v1/{endpoint}`) using `@wordpress/core-data`
- Support server-side pagination, sorting, filtering, and search
- Provide bulk actions with confirmation modals
- Integrate with SureCart admin UI patterns (sc-\* components, Emotion CSS, ModelSelector)

### SPA Shell Architecture

All DataView list pages run inside a **unified SPA shell** (`packages/admin/spa-shell/`). The shell handles:

- Client-side routing between list and detail views via `pushState`/`popstate`
- Cross-page navigation (Products ↔ Collections ↔ Settings) without full page reloads
- WordPress admin sidebar interception and active state management
- Header/title toggling between list and edit views

New entity list pages are registered in **`packages/admin/spa-shell/page-registry.js`** — no standalone entry points, PHP controllers, or view templates needed per entity.

### Reusable Component Library

All shared code lives in `packages/admin/components/dataview-list/`:

| File | Purpose |
|------|---------|
| `useDataViewState.js` | Hook: view state, query building, data fetching, status tabs, custom filters |
| `DataViewListLayout.js` | Component: tabs, header controls, card-wrapped DataViews table |
| `ConfirmDeleteModal.js` | Modal: reusable deletion confirmation with async busy state |
| `dataview-list-common.scss` | Shared styles: viewport-fit layout, checkbox visibility, padding, hover, footer, popover |
| `dataview-vendor-styles.js` | Webpack entry that imports `dataview-vendor.scss` → produces `dist/admin/style-dataview-vendor.css` |
| `dataview-vendor.scss` | Imports `@wordpress/dataviews/build-style/style.css` for extraction by webpack |
| `index.js` | Barrel export for all of the above |

PHP base class: `app/src/Support/Scripts/AdminListDataviewController.php` — extends `AdminModelEditController` with lighter deps and automatic CSS enqueuing.

## Reference Implementations

- **Products list** (with tabs + filters): `packages/admin/products/ProductsList.js`
- **Product Collections list** (simple, no tabs): `packages/admin/product-collections/ProductCollectionsList.js`
- **Currencies DataView**: `packages/admin/settings/display-currency/components/DisplayCurrenciesSettings.js`

Study both list implementations before starting any migration — Products has the most complete pattern (tabs, filters, bulk actions), Collections shows the minimal pattern (no tabs, simple CRUD).

## File Structure

Each DataView migration produces **one file** — the list component. Registration is done in the page registry.

```
packages/admin/{entity}/
  ├── {Entity}List.js             # Main component (uses useDataViewState + DataViewListLayout)
  └── {entity}-list-style.scss    # Imports shared common styles + entity-specific overrides

packages/admin/spa-shell/
  └── page-registry.js            # Register new entity here (list + detail components)

packages/admin/components/dataview-list/   # SHARED — do not duplicate
  ├── index.js
  ├── useDataViewState.js
  ├── DataViewListLayout.js
  ├── ConfirmDeleteModal.js
  ├── dataview-list-common.scss
  ├── dataview-vendor-styles.js            # Webpack entry → dist/admin/style-dataview-vendor.css
  └── dataview-vendor.scss                 # Imports @wordpress/dataviews vendor CSS
```

**No per-entity files needed for:** webpack entries, PHP controllers, PHP view templates, entry point roots, or App wrappers. The SPA shell handles all of that.

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

### 2. Register in the SPA Page Registry

Add the new entity to `packages/admin/spa-shell/page-registry.js`:

```js
import EntityList from '../{entity}/{Entity}List';
import Entity from '../{entity}/{Entity}';  // existing detail/edit component

const PAGES = {
  // ... existing pages ...
  'sc-{entity}': {
    list: EntityList,
    detail: Entity,
    title: __('{Entity}s', 'surecart'),
    newLabel: __('Add New', 'surecart'),  // set to null to hide "Add New" button
  },
};
```

The SPA shell automatically handles:
- Routing between list and detail views based on URL params (`action=edit&id=xxx`)
- Header title and "Add New" button rendering
- WordPress admin sidebar active state
- Browser history (back/forward)

The list component receives a `navigation` prop with helpers: `goToList()`, `goToCreate()`, `goToEdit(id)`, `isList`, `isCreate`, `isEdit`.

### 3. Update the PHP Controller

The existing PHP controller for the entity page needs to render the SPA shell view instead of its legacy view. Use the shared `enqueueSpaScripts()` and `renderSpaView()` pattern:

```php
// In the entity's controller (e.g., OrdersController.php):
public function index() {
    $this->enqueueSpaScripts();
    return $this->renderSpaView([
        'title'    => __('Orders', 'surecart'),
        'new_link' => \SureCart::getUrl()->edit('order'),
    ]);
}
```

The `enqueueSpaScripts()` method enqueues the SPA shell bundle which includes all registered entity components. No per-entity script controller is needed.

### 4. Create the List Component (using useDataViewState + DataViewListLayout)

The main component uses the reusable hook and layout. It receives `navigation` from the SPA shell:

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

const SORT_MAP = {
  name: 'name',
  date: 'cataloged_at',
};

const STATUS_TABS = [
  { value: 'active', label: __('Active', 'surecart') },
  { value: 'archived', label: __('Archived', 'surecart') },
  { value: 'all', label: __('All', 'surecart') },
];

const LAYOUT_STYLES = {
  name: { width: '25%' },       // Name column gets more space
  featured: { width: '60px' },  // Fixed-width columns
};

const DEFAULT_FIELDS = ['name', 'price', 'quantity', 'date'];

export default function EntityList({ navigation }) {
  const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
  const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);

  const {
    view, setView,
    status, setStatus,
    filters, setFilter,
    records, hasResolved, paginationInfo,
    invalidateList,
  } = useDataViewState({
    entity: 'product',                    // core-data entity name
    defaultSort: { field: 'date', direction: 'desc' },
    sortMap: SORT_MAP,                    // view field → API sort field
    defaultFields: DEFAULT_FIELDS,        // visible columns
    layoutStyles: LAYOUT_STYLES,          // column widths via DataViews API
    initialFilters: INITIAL_FILTERS,      // seed filters from URL params (see section below)
    buildQueryArgs: ({ status, filters }) => {
      const args = {};
      if (status === 'active') args.archived = false;
      else if (status === 'archived') args.archived = true;
      if (filters.collectionId) args.product_collection_ids = [filters.collectionId];
      return args;
    },
  });

  // Field definitions, action handlers, actions (see sections 5-7 below)
  const fields = useMemo(() => [/* ... */], []);
  const actions = useMemo(() => [/* ... */], []);

  return (
    <DataViewListLayout
      tabs={STATUS_TABS}
      activeTab={status}
      onTabChange={setStatus}
      headerControls={/* optional filter dropdowns */}
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

### 5. Map PHP Columns to DataView Fields

For each column in the PHP `get_columns()` method, create a field definition:

```js
const fields = useMemo(() => [
  {
    id: 'name',
    label: __('Name', 'surecart'),
    enableSorting: true,
    enableGlobalSearch: true,
    render: ({ item }) => (
      <div css={css`display:flex;align-items:center;gap:12px;`}>
        {/* Image thumbnail + edit link */}
      </div>
    ),
  },
  {
    id: 'price',
    label: __('Price', 'surecart'),
    enableSorting: false,
    render: ({ item }) => item?.range_display_amount || '-',
  },
  {
    id: 'date',
    label: __('Created', 'surecart'),
    enableSorting: true,
    render: ({ item }) => {
      if (!item?.cataloged_at) return '-';
      return new Date(item.cataloged_at * 1000).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    },
  },
], []);
```

**Field rules:**
- `enableSorting: true` only for columns that exist in PHP `get_sortable_columns()`
- `enableGlobalSearch: true` only for the primary search field
- Use `render` for custom cell content (images, tags, links, icons)
- For price display, use `item.range_display_amount` — pre-formatted like "$50 - $70"

### 6. Column Widths via layout.styles API

Use the DataViews native `layout.styles` API for column widths — **NOT** CSS `nth-child` selectors (fragile, breaks when columns reorder):

```js
// Pass to useDataViewState as layoutStyles:
const LAYOUT_STYLES = {
  name: { width: '25%' },
  featured: { width: '60px' },
  price: { maxWidth: '150px' },
};

// The hook sets: view.layout.styles = LAYOUT_STYLES
```

**Supported properties per field:** `width`, `maxWidth`, `minWidth`.
**Alignment guideline:** Right-align quantitative data (numbers, currency) — left-align text, dates, labels.

### 7. Map PHP Dropdown Filters to ModelSelector

If the PHP table has `extra_tablenav()` with dropdowns, use `ModelSelector` — **NOT** a native `<select>`. Pass it as `headerControls` to `DataViewListLayout`:

```jsx
import ModelSelector from '../components/ModelSelector';
import { ScMenuItem, ScDivider } from '@surecart/components-react';

const collectionFilter = (
  <ModelSelector
    name="product-collection"
    placeholder={__('All Product Collections', 'surecart')}
    searchPlaceholder={__('Search collections…', 'surecart')}
    value={filters.collectionId || ''}
    onSelect={(id) => setFilter('collectionId', id === filters.collectionId ? '' : id)}
    style={{ width: '100%' }}
    prefix={filters.collectionId ? (
      <>
        <ScMenuItem onClick={() => setFilter('collectionId', '')}>
          {__('All Product Collections', 'surecart')}
        </ScMenuItem>
        <ScDivider style={{ '--spacing': 'var(--sc-spacing-x-small)' }} />
      </>
    ) : null}
  />
);

// In render:
<DataViewListLayout headerControls={collectionFilter} ... />
```

### 8. URL Parameter Pre-Filtering (initialFilters)

If the PHP page supports navigation from another page with query parameters (e.g., `?sc_collection=xxx`), seed the filter state from the URL at module scope:

```js
import { getQueryArgs } from '@wordpress/url';

// Read URL params at module scope (runs once on load).
const URL_PARAMS = getQueryArgs( window.location.href );
const INITIAL_FILTERS = URL_PARAMS.sc_collection
  ? { collectionId: URL_PARAMS.sc_collection }
  : {};

// Pass to useDataViewState:
const { filters, setFilter, ... } = useDataViewState({
  entity: 'product',
  initialFilters: INITIAL_FILTERS,
  buildQueryArgs: ({ filters }) => {
    const args = {};
    if (filters.collectionId) args.product_collection_ids = [filters.collectionId];
    return args;
  },
});
```

The `initialFilters` config seeds `useState` for the custom filter state, so the ModelSelector `value` prop automatically reflects the pre-selected filter on first render. The `buildQueryArgs` callback converts it to API params. No extra logic needed — the hook handles page resets on filter change.

### 9. Map PHP Row Actions to DataView Actions

Use `navigation.goToEdit(id)` for SPA edit navigation instead of `window.location.href`:

```js
const actions = useMemo(() => [
  {
    id: 'edit',
    label: __('Edit', 'surecart'),
    icon: <Icon icon={edit} />,
    callback: ([item]) => { navigation.goToEdit(item.id); },
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
        <Text>{sprintf(_n('Delete %d item?', 'Delete %d items?', items.length, 'surecart'), items.length)}</Text>
        <HStack justify="end">
          <Button variant="tertiary" onClick={closeModal}>{__('Cancel', 'surecart')}</Button>
          <Button variant="primary" isDestructive onClick={() => { handleDelete(items); closeModal(); }}>
            {__('Delete', 'surecart')}
          </Button>
        </HStack>
      </VStack>
    ),
  },
], [navigation, handleArchiveToggle, handleDelete]);
```

### 10. Invalidating the List After Mutations

After any mutation (archive, duplicate, delete), **you must call `invalidateList()`** to re-fetch data. Without this, the list shows stale data until a page reload.

```js
const { invalidateList } = useDataViewState({ ... });

const handleArchiveToggle = useCallback(async (items) => {
  try {
    await Promise.all(items.map(item =>
      saveEntityRecord('surecart', 'product', { id: item.id, archived: !item.archived }, { throwOnError: true })
    ));
    invalidateList();  // ← Re-fetches the current query
    createSuccessNotice(__('Product archived.', 'surecart'), { type: 'snackbar' });
  } catch (error) {
    createErrorNotice(error?.message || __('Failed to update product.', 'surecart'), { type: 'snackbar' });
  }
}, [saveEntityRecord, invalidateList, createSuccessNotice, createErrorNotice]);
```

**Why `invalidateList()` is needed:**
- `saveEntityRecord` updates the entity in the core-data store, but doesn't invalidate the list query — the table still shows the old set of results
- `deleteEntityRecord` removes the entity but the list query cache isn't refreshed
- `apiFetch` (for custom endpoints like duplicate) creates entities outside the store entirely
- `invalidateList()` calls `invalidateResolution('getEntityRecords', [kind, entity, queryArgs])` which triggers `useEntityRecords` to re-fetch

**Snackbar notices:** The `DataViewListLayout` component includes a `<Notifications>` component that renders `@wordpress/notices` snackbar notices. Use `createSuccessNotice(msg, { type: 'snackbar' })` and `createErrorNotice(msg, { type: 'snackbar' })` from `useDispatch(noticesStore)`.

### 11. SCSS Styles

Import the shared common styles. Add entity-specific overrides only if needed:

```scss
// packages/admin/{entity}/{entity}-list-style.scss
@import "../components/dataview-list/dataview-list-common.scss";

// Entity-specific overrides go here (usually none needed).
```

The shared `dataview-list-common.scss` provides:
- **Viewport-fit layout:** `max-height: calc(100vh - 200px)` with `overflow-y: auto` on `.dataviews-wrapper`, sticky search bar and footer — keeps pagination visible without page scrolling
- Checkbox visibility (hide on rows, show on hover/check/focus, always show on touch devices)
- Table full-width + cell padding
- Search/footer/filter container padding
- Hover row color (SureCart brand background)
- Settings popover width constraint (320px — at global scope because it renders as a portal)
- Footer alignment (items left, pagination right)
- Bulk actions footer layout
- Loading/empty state centering

**Do NOT** `@import "@wordpress/dataviews/build-style/style.css"` in entity SCSS or in `dataview-list-common.scss`. That vendor CSS is handled by the dedicated `admin/dataview-vendor` webpack entry, producing a predictable `dist/admin/style-dataview-vendor.css` that all PHP controllers enqueue.

## useDataViewState Hook API

```js
const {
  view, setView,           // DataViews view state
  status, setStatus,       // Tab status (resets page to 1)
  filters, setFilter,      // Custom filter state: setFilter('key', value)
  records,                 // Fetched records array
  hasResolved,             // Data fetching complete?
  paginationInfo,          // { totalItems, totalPages }
  invalidateList,          // Call after mutations to re-fetch data
  queryArgs,               // Computed query args (for debugging)
} = useDataViewState({
  entity: 'product',                                     // core-data entity name
  kind: 'surecart',                                      // default: 'surecart'
  defaultSort: { field: 'date', direction: 'desc' },     // initial sort
  sortMap: { name: 'name', date: 'cataloged_at' },       // view field → API field
  defaultFields: ['name', 'price', 'date'],              // visible columns
  perPage: 20,                                           // items per page
  defaultStatus: 'active',                               // initial tab
  layoutStyles: { name: { width: '25%' } },              // column widths
  initialFilters: {},                                    // seed from URL params (see section 8)
  buildQueryArgs: ({ view, status, filters }) => ({}),   // entity-specific query args
});
```

## DataViewListLayout Props

```jsx
<DataViewListLayout
  // Tabs (optional — omit for pages without status tabs)
  tabs={[{ value: 'active', label: 'Active' }]}
  activeTab="active"
  onTabChange={(value) => {}}

  // Header controls (optional — filter dropdowns, buttons, etc.)
  headerControls={<ModelSelector ... />}

  // Content rendered next to the gear icon inside DataViews (optional)
  header={<Button>Export</Button>}

  // DataViews props (all forwarded)
  data={records}
  fields={fields}
  view={view}
  onChangeView={setView}
  paginationInfo={paginationInfo}
  actions={actions}
  isLoading={!hasResolved}
  isMutating={isMutating}  // shows loading overlay during inline mutations

  // Additional DataViews props as needed
  defaultLayouts={{ table: {} }}
/>
```

## DataViews API Quick Reference (v4.11.1)

### View State Shape
```js
{
  type: 'table',              // 'table' | 'grid' | 'list'
  perPage: 20,
  page: 1,
  sort: { field: 'date', direction: 'desc' },
  search: '',
  filters: [{ field: 'status', operator: 'is', value: 'active' }],
  fields: ['name', 'price'],  // visible field IDs + order
  layout: {
    styles: { name: { width: '25%' }, featured: { width: '60px' } },
    density: 'comfortable',   // 'comfortable' | 'balanced' | 'compact'
  },
}
```

### Field Properties
- `id`, `label`, `type` ('text'|'integer'|'date'|'boolean')
- `render: ({ item }) => ReactNode` — custom cell renderer
- `getValue: ({ item }) => any` — data accessor
- `enableSorting`, `enableHiding`, `enableGlobalSearch` — booleans
- `elements: [{ value, label }]` — for built-in filter dropdowns
- `filterBy: { operators: ['is', 'isNot'] }` — filter configuration

### Action Properties
- `id`, `label`, `icon`, `callback: (items) => void`
- `isPrimary`, `isDestructive`, `supportsBulk`
- `isEligible: (item) => boolean` — per-item availability
- `RenderModal`, `hideModalHeader`, `modalHeader`

### Important Props
- `search: true` — enables search input (DataViewListLayout sets this by default)
- `header` — React content rendered next to the gear icon
- `empty` — custom empty state UI
- `isItemClickable` / `onClickItem` — row click behavior

## Common Pitfalls

1. **Don't use `filterSortAndPaginate`** with server-side data — it re-paginates client-side
2. **Don't use `table-layout: fixed`** — causes text overlap. Use `layout.styles` for column widths
3. **Don't use CSS `nth-child` for column widths** — fragile, breaks on column reorder. Use `layout.styles`
4. **Don't set `titleField`** in view state unless you want DataViews to create a combined primary column (which duplicates your explicit name field)
5. **Use `@emotion/react`** (not `@emotion/core`) for the css prop
6. **Text domain must be `'surecart'`**
7. **Use `range_display_amount`** for price display — `metrics.min_price_amount_display` doesn't exist
8. **Use `ModelSelector`** for filter dropdowns, not native `<select>`
9. **Always check `hasResolved`** (or use `isLoading={!hasResolved}`) before rendering data
10. **Tabs must be WP-style text links** (`<ul>/<li>/<a>`) — not button groups or `TabPanel`
11. **Vendor CSS is a dedicated entry** — Don't `@import "@wordpress/dataviews/build-style/style.css"` in entity SCSS files. It's handled by the shared `admin/dataview-vendor` webpack entry → `dist/admin/style-dataview-vendor.css`. All PHP controllers enqueue this one file. If you import it in entity SCSS, webpack's splitChunks deduplicates unpredictably across entries
12. **Settings popover is a portal** — `.dataviews-view-config` renders as a WP Popover at the body level, NOT inside `.sc-dataview-list-wrapper`. Width constraints must be at global scope in `dataview-list-common.scss`
13. **No-tabs spacing** — When a page has no tabs/headerControls, the DataView card needs `margin-top: 12px` to maintain spacing from the page title. `DataViewListLayout` handles this automatically via the `!hasControls` condition
14. **Always call `invalidateList()` after mutations** — `saveEntityRecord`, `deleteEntityRecord`, and `apiFetch` do NOT automatically refresh the list query. Without `invalidateList()`, the table shows stale data until page reload. See section 10
15. **Seed filters from URL params at module scope** — Use `getQueryArgs(window.location.href)` outside the component (runs once on load) and pass as `initialFilters` to `useDataViewState`. This ensures the ModelSelector reflects the pre-selected value on first render. See section 8
16. **Use `navigation.goToEdit(id)` for edit links** — not `window.location.href`. The `navigation` prop from the SPA shell enables client-side routing without page reloads
17. **Register in page-registry.js** — not as a separate webpack entry. The SPA shell bundles all registered pages into one entry
18. **Component receives `navigation` prop** — the SPA shell passes `{ goToList, goToCreate, goToEdit, isList, isCreate, isEdit }` to all registered list/detail components

## Quick Migration Template

To migrate a new entity (e.g., Orders):

**1. `packages/admin/orders/OrdersList.js`** — Copy `ProductsList.js`, update:
- Entity name, sort map, tabs, fields, actions, filters
- Use `useDataViewState` + `DataViewListLayout`
- Accept `navigation` prop

**2. `packages/admin/orders/order-list-style.scss`**
```scss
@import "../components/dataview-list/dataview-list-common.scss";
```

**3. `packages/admin/spa-shell/page-registry.js`** — Register the entity:
```js
import OrdersList from '../orders/OrdersList';
import Order from '../orders/Order';  // existing detail component

'sc-orders': {
  list: OrdersList,
  detail: Order,
  title: __('Orders', 'surecart'),
  newLabel: __('Add New', 'surecart'),
},
```

**4. Update the entity's PHP controller** to use `enqueueSpaScripts()` + `renderSpaView()` instead of the legacy list table view.

That's it — no webpack entries, no standalone roots, no per-entity PHP script controllers needed.
