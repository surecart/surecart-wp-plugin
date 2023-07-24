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

	// Check variantOptions and previousVariants are array.
	if (!Array.isArray(variantOptions) || !Array.isArray(previousVariants)) {
		return variants;
	}

	// If variantOptions is empty, then return variants.
	if (variantOptions.length === 0) {
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
					[`option_1`]: variantOptions[0].values[i],
				});
			} else {
				variants.push({
					[`option_1`]: variantOptions[0].values[i],
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
						[`option_1`]: variantOptions[0].values[i],
						[`option_2`]: variantOptions[1].values[j],
					});
				} else {
					variants.push({
						[`option_1`]: variantOptions[0].values[i],
						[`option_2`]: variantOptions[1].values[j],
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
					console.log('previousValue', previousValue);

					if (previousValue) {
						variants.push({
							...previousValue,
							[`option_1`]: variantOptions[0].values[i],
							[`option_2`]: variantOptions[1].values[j],
							[`option_3`]: variantOptions[2].values[k],
						});
					} else {
						variants.push({
							[`option_1`]: variantOptions[0].values[i],
							[`option_2`]: variantOptions[1].values[j],
							[`option_3`]: variantOptions[2].values[k],
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
