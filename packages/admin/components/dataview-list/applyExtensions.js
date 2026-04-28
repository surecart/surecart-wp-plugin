/**
 * Apply third-party extensions to a dataview's fields and actions.
 *
 * Plugins can register extensions via the WordPress hooks API:
 *
 *   import { addFilter } from '@wordpress/hooks';
 *
 *   addFilter(
 *     'surecart.dataview.products.fields',
 *     'my-plugin/extra-product-column',
 *     ( fields ) => [
 *       ...fields,
 *       { id: 'inventory_value', label: 'Inventory Value', render: ... },
 *     ]
 *   );
 *
 * Hook names follow the pattern `surecart.dataview.{screen}.{kind}`:
 *   - `surecart.dataview.products.fields`
 *   - `surecart.dataview.products.actions`
 *   - `surecart.dataview.products.filterHandlers`
 *   - `surecart.dataview.product-collections.fields`
 *   ...etc.
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Apply field extensions for a screen.
 *
 * @param {string}   screen  e.g. 'products'
 * @param {Object[]} fields  base field definitions
 * @param {Object}   [context] available to filter callbacks
 * @returns {Object[]}
 */
export const applyFieldExtensions = (screen, fields, context = {}) =>
	applyFilters(`surecart.dataview.${screen}.fields`, fields, context);

/**
 * Apply action extensions for a screen.
 *
 * @param {string}   screen
 * @param {Object[]} actions
 * @param {Object}   [context]
 * @returns {Object[]}
 */
export const applyActionExtensions = (screen, actions, context = {}) =>
	applyFilters(`surecart.dataview.${screen}.actions`, actions, context);

/**
 * Apply query-handler extensions for a screen. Lets plugins add filter
 * handlers that map their own filters to REST query args.
 *
 * @param {string}     screen
 * @param {Function[]} handlers
 * @param {Object}     [context]
 * @returns {Function[]}
 */
export const applyFilterHandlerExtensions = (screen, handlers, context = {}) =>
	applyFilters(
		`surecart.dataview.${screen}.filterHandlers`,
		handlers,
		context
	);

/**
 * Apply default-fields extensions — lets plugins push their column id into
 * the default visible set without having to override the user's preferences.
 *
 * @param {string}   screen
 * @param {string[]} defaultFields
 * @param {Object}   [context]
 * @returns {string[]}
 */
export const applyDefaultFieldsExtensions = (
	screen,
	defaultFields,
	context = {}
) =>
	applyFilters(
		`surecart.dataview.${screen}.defaultFields`,
		defaultFields,
		context
	);
