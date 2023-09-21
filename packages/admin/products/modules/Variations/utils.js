/**
 * External dependencies.
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Generate variant combinations for up to three options
 *
 * @param {Array} variantOptions
 * @param {Array} previousVariants
 * @param {string} changeType - option_added | option_deleted | option_sorted | option_value_renamed | option_value_deleted | option_value_sorted | initially_loaded
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

	// If variantOptions length and previousVariants length are different,
	// then changeType should be option_added instead of option_value_renamed.
	// Cause, rename will walk thorugh index which would not be the case for add.
	if (
		variantOptions.length !== getNestedVariantLength(previousVariants) &&
		changeType === 'option_value_renamed'
	) {
		changeType = 'option_added';
	}

	if (variantOptions.length === 1) {
		// For 1 option
		for (let i = 0; i < variantOptions[0].values.length; i++) {
			const previousValue = findPreviousValue(
				variantOptions,
				previousVariants,
				i,
				changeType,
				1
			);

			if (previousValue) {
				delete previousValue.option_2;
				delete previousValue.option_3;

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
				const previousValue = findPreviousValue(
					variantOptions,
					previousVariants,
					{
						i,
						j,
					},
					changeType,
					2
				);

				if (previousValue) {
					delete previousValue.option_3;

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
					const previousValue = findPreviousValue(
						variantOptions,
						previousVariants,
						{
							i,
							j,
							k,
						},
						changeType,
						3
					);

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
 * Find previous value from previousVariants.
 *
 * @param {Array} variantOptions
 * @param {Array} previousVariants
 * @param {mixed} index
 * @param {String} changeType
 * @param {Number} nestedLength
 * @returns
 */
const findPreviousValue = (
	variantOptions,
	previousVariants,
	index,
	changeType,
	nestedLength = 1
) => {
	// For renaming, If index exist in previousVariants, then update the label only
	if (changeType === 'option_value_renamed') {
		if (nestedLength == 1) {
			return previousVariants[index] ?? null;
		}

		if (nestedLength == 2) {
			const { i, j } = index;
			const prevIndex = i * variantOptions[1]?.values.length + j;
			return previousVariants[prevIndex] ?? null;
		}

		if (nestedLength == 3) {
			const { i, j, k } = index;
			const prevIndex =
				i *
					variantOptions[1]?.values.length *
					variantOptions[2]?.values.length +
				j * variantOptions[2]?.values.length +
				k;
			return previousVariants[prevIndex] ?? null;
		}
	}

	if (nestedLength == 1) {
		const option1Value = variantOptions[0]?.values?.[index]?.label;
		return (
			previousVariants.find(
				({ option_1 }) => option_1 === option1Value
			) ?? null
		);
	}

	if (nestedLength == 2) {
		const { i, j } = index;
		const option1Value = variantOptions[0]?.values?.[i]?.label;
		const option2Value = variantOptions[1]?.values?.[j]?.label;
		return (
			previousVariants.find(
				({ option_1, option_2 }) =>
					(option_1 === option1Value && option_2 === option2Value) ||
					(option_1 === option2Value && option_2 === option1Value)
			) ?? null
		);
	}

	if (nestedLength === 3) {
		const { i, j, k } = index;
		const option1Value = variantOptions[0]?.values?.[i]?.label;
		const option2Value = variantOptions[1]?.values?.[j]?.label;
		const option3Value = variantOptions[2]?.values?.[k]?.label;

		return (
			previousVariants.find(
				({ option_1, option_2, option_3 }) =>
					(option_1 === option1Value &&
						option_2 === option2Value &&
						option_3 === option3Value) ||
					(option_1 === option1Value &&
						option_2 === option3Value &&
						option_3 === option2Value) ||
					(option_1 === option2Value &&
						option_2 === option1Value &&
						option_3 === option3Value) ||
					(option_1 === option2Value &&
						option_2 === option3Value &&
						option_3 === option1Value) ||
					(option_1 === option3Value &&
						option_2 === option1Value &&
						option_3 === option2Value) ||
					(option_1 === option3Value &&
						option_2 === option2Value &&
						option_3 === option1Value)
			) ?? null
		);
	}
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
 * Does this have any duplicate option.[key].
 */
export const hasDuplicate = (options = [], key) => {
	const optionData = [...options];
	return optionData.some((option, index) => {
		return optionData.some((option2, index2) => {
			return option?.[key] === option2?.[key] && index !== index2;
		});
	});
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
