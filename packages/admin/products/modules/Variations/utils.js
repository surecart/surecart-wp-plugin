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
	const variants = [];
	// Generate all possible combinations of options
	const optionCombinations = generateValueCombinations(variantOptions);
	// Generate all possible combinations of options
	const previousCombinations = generateValueCombinations(previousOptions);
	// Handle new addition or subtraction - we will use the new option combinations since values have not changed.
	const combinations =
		optionCombinations.length !== previousCombinations.length
			? optionCombinations
			: previousCombinations;

	// Generate variants based on option combinations
	optionCombinations.forEach((combination, index) => {
		// if the values have not changed, we should be able to find the index of the previous combination.
		const newIndex = (combinations || []).findIndex((prevCombination) => {
			return (prevCombination || []).every(
				(element, index) => combination[index] === element
			);
		});

		// make sure we have a valid index.
		const foundIndex = newIndex >= 0 ? newIndex : index;

		const variant =
			previousVariants.find((variant) =>
				(combinations?.[foundIndex] || []).every(
					(element, index) =>
						variant[`option_${index + 1}`] === element
				)
			) || {};

		const newVariant = { ...variant };

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
		const values = curr.values
			.filter((value) => value.label)
			.map((value) => value.label);
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
