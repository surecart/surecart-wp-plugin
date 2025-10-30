import { useCallback } from '@wordpress/element';

/**
 * Hook to manage variant value overrides.
 * If a variant's value is null/undefined, falls back to the product's value.
 *
 * @param {Object} variant - The variant object
 * @param {Object} product - The product object
 * @returns {Object} - Object containing getValue, isOverridden, and getValues functions
 */
export default ({ variant, product }) => {
	/**
	 * Get variant value with fallback to product value.
	 * Memoized to prevent unnecessary recalculations.
	 */
	const getValue = useCallback(
		(attribute) => {
			const variantValue = variant?.[attribute];

			// Check for null or undefined (but allow falsy values like 0 or false)
			if (variantValue === null || variantValue === undefined) {
				return product?.[attribute];
			}

			return variantValue;
		},
		[variant, product]
	);

	/**
	 * Check if a variant value is explicitly set (not inherited from product).
	 */
	const isOverridden = useCallback(
		(attribute) => {
			return (
				variant?.[attribute] !== null &&
				variant?.[attribute] !== undefined &&
				variant?.[attribute] !== product?.[attribute]
			);
		},
		[variant]
	);

	/**
	 * Get multiple values at once (useful for reducing re-renders).
	 */
	const getValues = useCallback(
		(attributes = []) => {
			return attributes.reduce((acc, attr) => {
				acc[attr] = getValue(attr);
				return acc;
			}, {});
		},
		[getValue]
	);

	/**
	 * Check if any of the provided attributes are overridden.
	 */
	const hasOverrides = useCallback(
		(attributes = []) => {
			return attributes.some((attr) => isOverridden(attr));
		},
		[isOverridden]
	);

	/**
	 * Get update values with automatic null conversion for matching product values.
	 * If a variant value matches the product value, set it to null to inherit.
	 * This prevents storing duplicate values and ensures proper override tracking.
	 */
	const getUpdateValue = useCallback(
		(updates = {}) => {
			return Object.keys(updates).reduce((acc, key) => {
				acc[key] = updates[key] == product?.[key] ? null : updates[key];
				return acc;
			}, {});
		},
		[product]
	);

	return {
		getValue,
		isOverridden,
		getValues,
		hasOverrides,
		getUpdateValue,
	};
};
