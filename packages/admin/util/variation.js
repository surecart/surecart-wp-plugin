export const getVariantLabel = (variantOptions = []) => {
	if (!variantOptions.length) {
		return '';
	}

	return variantOptions.filter(Boolean).join(' / ');
};
