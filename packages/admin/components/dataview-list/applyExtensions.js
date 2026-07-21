// Hook names: `surecart.dataview.{screen}.{fields|actions|filterHandlers|defaultFields}`
//
//   addFilter('surecart.dataview.products.fields', 'my-plugin', (fields) => [...fields, customField]);
import { applyFilters } from '@wordpress/hooks';

export const applyFieldExtensions = (screen, fields, context = {}) =>
	applyFilters(`surecart.dataview.${screen}.fields`, fields, context);

export const applyActionExtensions = (screen, actions, context = {}) =>
	applyFilters(`surecart.dataview.${screen}.actions`, actions, context);

export const applyFilterHandlerExtensions = (screen, handlers, context = {}) =>
	applyFilters(`surecart.dataview.${screen}.filterHandlers`, handlers, context);

export const applyDefaultFieldsExtensions = (screen, defaultFields, context = {}) =>
	applyFilters(`surecart.dataview.${screen}.defaultFields`, defaultFields, context);
