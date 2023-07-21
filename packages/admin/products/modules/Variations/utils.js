export function generateVariants(variantOptions) {
	const variants = [];

	// TODO: Improve this with a recursive function.
	function generateCombinations(currentVariant, index) {
		if (index === variantOptions.length) {
			variants.push({ ...currentVariant });
			return;
		}

		const option = variantOptions[index];

		for (let i = 0; i < option.values.length; i++) {
			currentVariant[option.name] = option.values[i];
			generateCombinations(currentVariant, index + 1);
		}
	}

	// Generate combinations for up to three options
	if (variantOptions.length === 0) {
		return variants;
	} else if (variantOptions.length === 1) {
		for (let i = 0; i < variantOptions[0].values.length; i++) {
			variants.push({
				[`option_1`]: variantOptions[0].values[i],
			});
		}
	} else if (variantOptions.length === 2) {
		for (let i = 0; i < variantOptions[0].values.length; i++) {
			for (let j = 0; j < variantOptions[1].values.length; j++) {
				variants.push({
					[`option_1`]: variantOptions[0].values[i],
					[`option_2`]: variantOptions[1].values[j],
				});
			}
		}
	} else if (variantOptions.length === 3) {
		for (let i = 0; i < variantOptions[0].values.length; i++) {
			for (let j = 0; j < variantOptions[1].values.length; j++) {
				for (let k = 0; k < variantOptions[2].values.length; k++) {
					variants.push({
						[`option_1`]: variantOptions[0].values[i],
						[`option_2`]: variantOptions[1].values[j],
						[`option_3`]: variantOptions[2].values[k],
					});
				}
			}
		}
	}

	return prepareVariants(variants);
}

function prepareVariants(variants) {
	const newVariants = [];

	for (const variant of variants) {
		const newVariant = {
			...variant,
		};

		for (const [key, value] of Object.entries(variant)) {
			newVariant[key] = value.label;
		}
		newVariants.push(newVariant);
	}

	// Append position by index.
	for (const [index, variant] of newVariants.entries()) {
		variant.position = index;
	}

	return newVariants;
}
