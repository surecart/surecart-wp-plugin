/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import PriceChoices from '@scripts/blocks/components/PriceChoices';
import { updateCartLineItem } from '../../../util';

export default ({ attributes, setAttributes }) => {
	const { prices } = attributes;

	const removeChoice = (index) => {
		setAttributes({
			prices: prices.filter((item, i) => i !== index),
		});
	};

	const updateChoice = (data) =>
		setAttributes({ prices: updateCartLineItem(data, prices) });

	return (
		<div
			css={css`
				font-size: 13px;
				padding-bottom: 8px;
			`}
		>
			<PriceChoices
				choices={prices}
				onUpdate={updateChoice}
				onRemove={removeChoice}
			/>
		</div>
	);
};
