/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Generate variant combinations for up to three options
 *
 * @param {Array} variantOptions
 * @param {Array} previousVariants
 * @return {Array}
 */
export function generateVariants(variantOptions, previousVariants = []) {
	const variants = [];

	// Check parameters are valid.
	if (
		!Array.isArray(variantOptions) || // not array.
		!Array.isArray(previousVariants) || // not array.
		variantOptions.length === 0 // empty array.
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
}

/**
 * Prepare variants array by adding position and converting optionValue to label.
 *
 * @param {Array} variants
 * @returns {Array}
 */
function prepareVariants(variants) {
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
	for (const [index, variant] of newVariants.entries()) {
		variant.position = index;
		variant.index = index;
	}

	return newVariants;
}

/**
 * Get diffing variants from variants and previousVariants.
 *
 * @param {Array} variants
 * @param {Array} previousVariants
 * @returns {Array}
 */
export const getDiffingVariants = (variants, previousVariants) => {
	const diffingVariants = [];
	let variantNestedLength = 1;

	// Get the nested length of variants first.
	for (const { option_2, option_3, index } of variants) {
		if (index === 0) {
			variantNestedLength = option_3 ? 3 : option_2 ? 2 : 1;
		}
	}

	// Handle 1 option: If option_1 of variants didn't found in previousVariants,
	// then add it to diffingVariants.
	if (variantNestedLength === 1) {
		for (const variant of variants) {
			if (
				!previousVariants.find(
					(prevVariant) => prevVariant?.option_1 === variant?.option_1
				)
			) {
				diffingVariants.push(variant);
			}
		}
	}

	// Handle 2 options: If option_1 and option_2 of variants didn't found in previousVariants,
	// then add it to diffingVariants.
	if (variantNestedLength === 2) {
		for (const variant of variants) {
			if (
				!previousVariants.find(
					(prevVariant) =>
						(prevVariant?.option_1 === variant?.option_1 &&
							prevVariant?.option_2 === variant.option_2) ||
						(prevVariant?.option_1 === variant?.option_2 &&
							prevVariant?.option_2 === variant.option_1)
				)
			) {
				diffingVariants.push(variant);
			}
		}
	}

	// Handle 3 options: If option_1, option_2 and option_3 of variants didn't found in previousVariants,
	// then add it to diffingVariants.
	if (variantNestedLength === 3) {
		for (const variant of variants) {
			if (
				!previousVariants.find(
					(prevVariant) =>
						(prevVariant?.option_1 === variant?.option_1 &&
							prevVariant?.option_2 === variant.option_2 &&
							prevVariant?.option_3 === variant.option_3) ||
						(prevVariant?.option_1 === variant?.option_1 &&
							prevVariant?.option_2 === variant.option_3 &&
							prevVariant?.option_3 === variant.option_2) ||
						(prevVariant?.option_1 === variant?.option_2 &&
							prevVariant?.option_2 === variant.option_1 &&
							prevVariant?.option_3 === variant.option_3) ||
						(prevVariant?.option_1 === variant?.option_2 &&
							prevVariant?.option_2 === variant.option_3 &&
							prevVariant?.option_3 === variant.option_1) ||
						(prevVariant?.option_1 === variant?.option_3 &&
							prevVariant?.option_2 === variant.option_1 &&
							prevVariant?.option_3 === variant.option_2) ||
						(prevVariant?.option_1 === variant?.option_3 &&
							prevVariant?.option_2 === variant.option_2 &&
							prevVariant?.option_3 === variant.option_1)
				)
			) {
				diffingVariants.push(variant);
			}
		}
	}

	// Keep only option_1, option_2 and option_3 in diffingVariants
	// and remove other keys from variant
	return diffingVariants.map((variant) => {
		let newVariant = {
			option_1: variant.option_1,
		};

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
 * Store deleted variants in localStorage.
 *
 * @param {Array} variants
 */
export function trackDeletedVariants(variants) {
	localStorage.setItem('surecart_deleted_variants', JSON.stringify(variants));
}

/**
 * Get deleted variants from localStorage.
 *
 * @returns {Array}
 */
export function getDeletedVariants() {
	return JSON.parse(
		localStorage.getItem('surecart_deleted_variants') ?? '[]'
	);
}

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
