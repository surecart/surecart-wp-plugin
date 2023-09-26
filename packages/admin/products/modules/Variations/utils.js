/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Generate variant combinations for up to three options
 *
 * @param {Array} variantOptions
 * @param {Array} previousVariants
 *
 * @return {Array}
 */
export const generateVariants = (variantOptions, previousVariants = []) => {
	const variants = [];

	// Check parameters are valid.
	if (
		!Array.isArray(variantOptions) ||
		!Array.isArray(previousVariants) ||
		variantOptions.length === 0
	) {
		return variants;
	}

	if (variantOptions.length === 1) {
		// For 1 option
		for (let i = 0; i < variantOptions[0].values.length; i++) {
			const previousValue = findPreviousValue(
				variantOptions,
				previousVariants,
				i,
				1
			);

			variants.push({
				...(previousValue ? previousValue : {}),
				option_1: variantOptions[0].values[i],
				option_2: null,
				option_3: null,
			});
		}
	} else if (variantOptions.length === 2) {
		for (let i = 0; i < variantOptions[0].values.length; i++) {
			for (let j = 0; j < variantOptions[1].values.length; j++) {
				let previousValue = null;
				// If this is the first item, then we need to find previous value of nested length 2.
				if (variantOptions[1].values.length === 1) {
					previousValue = findPreviousValue(
						variantOptions,
						previousVariants,
						i,
						1
					);
				} else {
					previousValue = findPreviousValue(
						variantOptions,
						previousVariants,
						{
							i,
							j,
						},
						2
					);
				}

				variants.push({
					...(previousValue ? previousValue : {}),
					option_1: variantOptions[0].values[i],
					option_2: variantOptions[1].values[j],
					option_3: null,
				});
			}
		}
	} else if (variantOptions.length === 3) {
		for (let i = 0; i < variantOptions[0].values.length; i++) {
			for (let j = 0; j < variantOptions[1].values.length; j++) {
				for (let k = 0; k < variantOptions[2].values.length; k++) {
					// If this is the first item, then we need to find previous value of nested length 2.
					let previousValue = null;
					if (variantOptions[2].values.length === 1) {
						previousValue = findPreviousValue(
							variantOptions,
							previousVariants,
							{
								i,
								j,
							},
							2
						);
					} else {
						// Else the nested length would be 3.
						previousValue = findPreviousValue(
							variantOptions,
							previousVariants,
							{
								i,
								j,
								k,
							},
							3
						);
					}

					variants.push({
						...(previousValue ? previousValue : {}),
						option_1: variantOptions[0].values[i],
						option_2: variantOptions[1].values[j],
						option_3: variantOptions[2].values[k],
					});
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
 * @param {Number} nestedLength
 * @returns
 */
const findPreviousValue = (
	variantOptions,
	previousVariants,
	index,
	nestedLength = 1
) => {
	if (nestedLength === 1) {
		const option1Id = variantOptions[0]?.values?.[index]?.id;
		return (
			previousVariants.find(
				({ option_1_id }) => option_1_id === option1Id
			) ?? null
		);
	}

	if (nestedLength === 2) {
		const { i, j } = index;
		const option1Id = variantOptions[0]?.values?.[i]?.id;
		const option2Id = variantOptions[1]?.values?.[j]?.id;
		return (
			previousVariants.find(
				({ option_1_id, option_2_id }) =>
					(option_1_id === option1Id && option_2_id === option2Id) ||
					(option_1_id === option2Id && option_2_id === option1Id)
			) ?? null
		);
	}

	if (nestedLength === 3) {
		const { i, j, k } = index;
		const option1Id = variantOptions[0]?.values?.[i]?.id;
		const option2Id = variantOptions[1]?.values?.[j]?.id;
		const option3Id = variantOptions[2]?.values?.[k]?.id;

		return (
			previousVariants.find(
				({ option_1_id, option_2_id, option_3_id }) =>
					(option_1_id === option1Id &&
						option_2_id === option2Id &&
						option_3_id === option3Id) ||
					(option_1_id === option1Id &&
						option_2_id === option3Id &&
						option_3_id === option2Id) ||
					(option_1_id === option2Id &&
						option_2_id === option1Id &&
						option_3_id === option3Id) ||
					(option_1_id === option2Id &&
						option_2_id === option3Id &&
						option_3_id === option1Id) ||
					(option_1_id === option3Id &&
						option_2_id === option1Id &&
						option_3_id === option2Id) ||
					(option_1_id === option3Id &&
						option_2_id === option2Id &&
						option_3_id === option1Id)
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
	const variantNestedLength = (variants ?? []).map(({ option_2, option_3 }) =>
		option_3 ? 3 : option_2 ? 2 : 1
	);
	return Math.max(...variantNestedLength);
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
			if (!!value?.label && !!value?.id) {
				newVariant[`${key}_id`] = value.id;
				newVariant[key] = value.label;
			} else {
				newVariant[key] = value?.label ?? value;
			}
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
