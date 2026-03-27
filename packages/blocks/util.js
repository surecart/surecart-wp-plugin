const stripHTML = (text) => {
	const parsedLabel = new DOMParser().parseFromString(text, 'text/html');
	return parsedLabel?.body?.textContent || '';
};

/**
 * Converts a spacing preset into a custom value.
 *
 * @param {string} value Value to convert.
 *
 * @return {string} CSS var string for given spacing preset value.
 */
const getSpacingPresetCssVar = (value) => {
	if (!value) {
		return;
	}

	const slug = value.match(/var:preset\|spacing\|(.+)/);

	if (!slug) {
		return value;
	}

	return `var(--wp--preset--spacing--${slug[1]})`;
};

/**
 * Converts a font size preset into a custom value.
 *
 * @param {string} value Value to convert.
 *
 * @return {string} CSS var string for given spacing preset value.
 */
const getFontSizePresetCssVar = (value) => {
	if (!value) {
		return;
	}

	return `var(--wp--preset--font-size--${value})`;
};

/**
 * Converts a color preset into a custom value.
 *
 * @param {string} value Value to convert.
 *
 * @return {string} CSS var string for given spacing preset value.
 */
const getColorPresetCssVar = (value) => {
	if (!value) {
		return;
	}

	return `var(--wp--preset--color--${value})`;
};

export const updateCartLineItem = (data, existing = []) => {
	if (data?.variant_id) {
		const existingVariant = existing?.find(
			(item) => item?.variant_id === data.variant_id
		);
		if (existingVariant) {
			return existing.map((item) => {
				if (item?.variant_id !== existingVariant?.variant_id)
					return item;
				return {
					...item,
					...{
						quantity: data?.quantity
							? data.quantity
							: existingVariant?.quantity + 1,
					},
					...{
						ad_hoc_amount: data?.ad_hoc_amount
							? data.ad_hoc_amount
							: existingVariant?.ad_hoc_amount,
					},
				};
			});
		}
	}

	// find existing price.
	const existingPrice = existing?.find(
		(item) => item?.id === data.id && !data?.variant_id
	);
	if (existingPrice) {
		return existing.map((item) => {
			if (item?.id !== existingPrice?.id) return item;
			return {
				...item,
				...{
					quantity: data?.quantity
						? data.quantity
						: existingPrice?.quantity + 1,
				},
				...{
					ad_hoc_amount: data?.ad_hoc_amount
						? data.ad_hoc_amount
						: existingPrice?.ad_hoc_amount,
				},
			};
		});
	}

	// add new.
	return [
		...existing,
		{
			...data,
			quantity: 1,
		},
	];
};

export {
	stripHTML,
	getSpacingPresetCssVar,
	getFontSizePresetCssVar,
	getColorPresetCssVar,
};
