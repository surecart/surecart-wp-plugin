import { getCSSRules } from '@wordpress/style-engine';

/**
 * Returns the inline styles to add depending on the style object
 *
 * @param {Object} styles Styles configuration.
 *
 * @return {Object} Flattened CSS variables declaration.
 */
export function getInlineStyles(styles = {}) {
	const output = {};
	// The goal is to move everything to server side generated engine styles
	// This is temporary as we absorb more and more styles into the engine.
	getCSSRules(styles).forEach((rule) => {
		output[rule.key] = rule.value;
	});

	return output;
}
