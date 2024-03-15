/**
 * WordPress dependencies
 */
import { store, getContext } from '@wordpress/interactivity';
const { addQueryArgs } = wp.url; // TODO: replace with `@wordpress/url` when available.

// controls the product page.
const { state, callbacks, actions } = store('surecart/product-list', {});