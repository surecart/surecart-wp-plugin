/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

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
		// this handles reordering of options.
		let variant = previousVariants.find((variant) =>
			combination.every((element) =>
				[variant.option_1, variant.option_2, variant.option_3]
					.filter(Boolean)
					.includes(element)
			)
		);

		// if the values have not changed, we should be able to find the index of the previous combination.
		const newIndex = (combinations || []).findIndex((prevCombination) =>
			(prevCombination || []).every(
				(element, index) => combination[index] === element
			)
		);

		// make sure we have a valid index.
		const foundIndex = newIndex >= 0 ? newIndex : index;

		// the previous variant values changed
		if (!variant) {
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
