/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/** Fill in any missing deleted variants and set the status. */
export const normalizeVariants = (product) =>
	(
		generateVariants(
			product?.variant_options || [],
			product?.variant_options || [],
			product?.variants
		) || []
	).map((variant) => {
		return {
			...variant,
			status: variant?.id ? 'active' : 'deleted', // if the id is not present, it has been deleted.
		};
	});

/**
 * Generate Variants based on options.
 */
export const generateVariants = (
	variantOptions,
	previousOptions,
	previousVariants = []
) => {
	// initialize position we need to store in the variant.
	let position = 0;
	// holds the variants based on options.
	const variants = [];
	// Generate all possible combinations of options
	const optionCombinations = generateValueCombinations(variantOptions);
	// Generate all possible combinations of options
	const previousCombinations = generateValueCombinations(previousOptions);

	// If the option combinations lengths have not changed, we will use the updated option combinations.
	const combinations =
		optionCombinations.length !== previousCombinations.length
			? optionCombinations
			: previousCombinations;

	// Generate variants based on option combinations
	optionCombinations.forEach((combination, index) => {
		// search through previous variants to find the variant that matches the combination.
		// this handles when(option_1, option_2, option_3) have switched order but the values are the same.
		let variant = previousVariants.find((variant) =>
			combination.every((element) =>
				[variant.option_1, variant.option_2, variant.option_3]
					.filter(Boolean)
					.includes(element)
			)
		);

		// we don't have a variant, which means the values changed.
		// they either changed the order, or they changed the values.
		if (!variant) {
			// to handle the order changing, we will find the index of the combination in the previous combinations.
			const newIndex = (combinations || []).findIndex((prevCombination) =>
				(prevCombination || []).every(
					(element, index) => combination[index] === element
				)
			);

			// we will have a new index if it was reordered.
			// otherwise the values have changed.
			const foundIndex = newIndex >= 0 ? newIndex : index;

			// get the variant from the previous variants using the index from the combinations.
			variant = previousVariants.find((variant) =>
				(combinations?.[foundIndex] || []).every(
					(element, index) =>
						variant[`option_${index + 1}`] === element
				)
			);
		}

		const newVariant = { ...(variant || {}), position: position++ };
		previousOptions.forEach((_, index) => {
			newVariant[`option_${index + 1}`] = combination[index] || null;
		});
		// append to variants.
		variants.push(newVariant);
	});

	return variants;
};

/**
 * Generate value combinations based on options.
 */
export const generateValueCombinations = (options = []) =>
	(options || []).reduce((acc, curr) => {
		// use just the label for the combination.
		const values = curr.values.filter((value) => !!value);
		// not values, just return the existing accumulator.
		if (!values?.length) return acc;
		// if no values, return the accumulator.
		return acc.length === 0
			? values.map((value) => [value])
			: acc.flatMap((option) =>
					values.map((value) => [...option, value])
			  );
	}, []);

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
