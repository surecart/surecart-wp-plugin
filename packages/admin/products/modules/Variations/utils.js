/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Generate variant combinations for up to three options
 *
 * @param {Array} variantOptions
 * @param {Array} previousVariants
 * @param {string} changeType - option_deleted | option_sorted | option_value_renamed | option_value_deleted | option_value_sorted
 *
 * @return {Array}
 */
export const generateVariants = (
	variantOptions,
	previousVariants = [],
	changeType = 'option_value_renamed'
) => {
	const variants = [];

	// Check parameters are valid.
	if (
		!Array.isArray(variantOptions) ||
		!Array.isArray(previousVariants) ||
		variantOptions.length === 0
	) {
		return variants;
	}

	// TODO: Improve this with a recursive function.
	if (variantOptions.length === 1) {
		for (let i = 0; i < variantOptions[0].values.length; i++) {
			// For 1 option -->
			// If index exist in previousVariants, then update the label only
			const previousValue = previousVariants[i] ?? null;
			if (previousValue) {
				variants.push({
					...previousValue,
					option_1: variantOptions[0].values[i],
				});
			} else {
				variants.push({
					option_1: variantOptions[0].values[i],
				});
			}
		}
	} else if (variantOptions.length === 2) {
		for (let i = 0; i < variantOptions[0].values.length; i++) {
			for (let j = 0; j < variantOptions[1].values.length; j++) {
				// If index exist in previousVariants, then update the label only
				const prevIndex = i * variantOptions[1]?.values.length + j;
				const previousValue = previousVariants[prevIndex] ?? null;

				if (previousValue) {
					variants.push({
						...previousValue,
						option_1: variantOptions[0].values[i],
						option_2: variantOptions[1].values[j],
					});
				} else {
					variants.push({
						option_1: variantOptions[0].values[i],
						option_2: variantOptions[1].values[j],
					});
				}
			}
		}
	} else if (variantOptions.length === 3) {
		for (let i = 0; i < variantOptions[0].values.length; i++) {
			for (let j = 0; j < variantOptions[1].values.length; j++) {
				for (let k = 0; k < variantOptions[2].values.length; k++) {
					// If index exist in previousVariants, then update the label only
					const prevIndex =
						i *
							variantOptions[1]?.values.length *
							variantOptions[2]?.values.length +
						j * variantOptions[2]?.values.length +
						k;
					const previousValue = previousVariants[prevIndex] ?? null;

					if (previousValue) {
						variants.push({
							...previousValue,
							option_1: variantOptions[0].values[i],
							option_2: variantOptions[1].values[j],
							option_3: variantOptions[2].values[k],
						});
					} else {
						variants.push({
							option_1: variantOptions[0].values[i],
							option_2: variantOptions[1].values[j],
							option_3: variantOptions[2].values[k],
						});
					}
				}
			}
		}
	}

	return prepareVariants(variants);
};

/**
 * Sort variants by position.
 *
 * @param {Array} variants
 * @returns {Array}
 */
export const sortVariants = (variants) => {
	for (const [index, variant] of variants.entries()) {
		variant.position = index;
		variant.index = index;
	}

	return variants;
};

/**
 * Get excluded variants from variants and deletedVariants.
 *
 * @param {Array} variants
 * @param {Array} deletedVariants
 * @returns {Array}
 */
export const getExlcudedVariants = (variants, deletedVariants) => {
	if (!variants?.length || !deletedVariants?.length) {
		return variants;
	}

	const variantNestedLength = getNestedVariantLength(variants);
	const filterFn = createFilterFn(deletedVariants, variantNestedLength);
	const excludedVariants = filterVariants(variants, filterFn);

	return sortVariants(excludedVariants);
};

/**
 * Get diffing variants from variants and previousVariants.
 *
 * @param {Array} variants
 * @param {Array} previousVariants
 * @returns {Array}
 */
export const getDiffingVariants = (variants, previousVariants) => {
	if (!variants?.length || !previousVariants?.length) {
		return variants;
	}

	const variantNestedLength = getNestedVariantLength(variants);
	const filterFn = createFilterFn(previousVariants, variantNestedLength);
	const diffingVariants = filterVariants(variants, filterFn);

	return diffingVariants.map((variant) => {
		let newVariant = { option_1: variant.option_1 };
		if (variantNestedLength >= 2) {
			newVariant.option_2 = variant.option_2;
		}
		if (variantNestedLength === 3) {
			newVariant.option_3 = variant.option_3;
		}
		return newVariant;
	});
};

/**
 * Get nested variant length.
 *
 * @param {Array} variants
 * @returns {number}
 */
export const getNestedVariantLength = (variants = []) => {
	let variantNestedLength = 1;

	(variants ?? []).forEach(({ option_2, option_3 }, index) => {
		if (index === 0) {
			variantNestedLength = option_3 ? 3 : option_2 ? 2 : 1;
		}
	});

	return variantNestedLength;
};

/**
 * Store deleted variants in localStorage.
 *
 * @param {Array} variants
 */
export const trackDeletedVariants = (variants) => {
	localStorage.setItem('surecart_deleted_variants', JSON.stringify(variants));
};

/**
 * Get deleted variants from localStorage.
 *
 * @returns {Array}
 */
export const getDeletedVariants = () => {
	return JSON.parse(
		localStorage.getItem('surecart_deleted_variants') ?? '[]'
	);
};

/**
 * If any duplicate optionValue.label is found.
 *
 * @returns object
 */
export const checkOptionValueError = (optionValues = []) => {
	const optionValuesData = [...optionValues];
	let error = {
		message: '',
	};

	// If optionValues filtered trimmed data is empty, then error.
	if (
		optionValuesData.filter((optionValue) => {
			return optionValue.label !== '';
		}).length === 0
	) {
		error.message = __('Option values are required.', 'surecart');
	}

	const hasDuplicateValue = optionValuesData.find((optionValue, index) => {
		return (
			optionValuesData.findIndex((optionValue2, index2) => {
				return (
					optionValue.label === optionValue2.label && index !== index2
				);
			}) !== -1
		);
	});

	if (hasDuplicateValue) {
		error.message = __('Option values should not be the same.', 'surecart');
	}

	return {
		hasDuplicate: hasDuplicateValue,
		error,
	};
};

/**
 * Filter the variations to remove draft variations.
 *
 * TODO: This function is not used anywhere. Remove after testing with API way.
 *
 * @param {object} product
 * @returns {object}
 */
export const processVariationsForSaving = (product) => {
	const { variants } = product;

	if (!variants) {
		return product;
	}

	return {
		...product,
		variants: (variants ?? []).filter((variation) => {
			return variation?.status !== 'draft';
		}),
	};
};

/**
 * Prepare variants array by adding position and converting optionValue to label.
 *
 * @param {Array} variants
 * @returns {Array}
 */
const prepareVariants = (variants) => {
	const newVariants = [];

	for (const variant of variants) {
		const newVariant = {
			...variant,
		};

		for (const [key, value] of Object.entries(newVariant)) {
			newVariant[key] = value?.label ?? value;
		}
		newVariants.push(newVariant);
	}

	// Append position by index.
	return sortVariants(newVariants);
};

/**
 * Filter variants by intermediary filterFn.
 *
 * @param {Array} variants
 * @param {Function} filterFn
 * @returns {Array}
 */
const filterVariants = (variants, filterFn) => {
	const filteredVariants = [];
	for (const variant of variants) {
		if (!filterFn(variant)) {
			filteredVariants.push(variant);
		}
	}
	return filteredVariants;
};

/**
 * Create filter function for variants
 * A common function for getExlcudedVariants and getDiffingVariants.
 *
 * @param {Array} deletedVariants
 * @param {Number} nestedLength
 * @returns
 */
const createFilterFn = (deletedVariants, nestedLength) => {
	return (variant) => {
		for (const deletedVariant of deletedVariants) {
			let match = true;
			for (let i = 1; i <= nestedLength; i++) {
				const optionKey = `option_${i}`;
				if (variant[optionKey] !== deletedVariant[optionKey]) {
					match = false;
					break;
				}
			}
			if (match) {
				return true;
			}
		}
		return false;
	};
};
