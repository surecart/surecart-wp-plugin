export const getVariantLabel = (variantOptions = []) =>
	(variantOptions || []).filter(Boolean).join(' / ');
