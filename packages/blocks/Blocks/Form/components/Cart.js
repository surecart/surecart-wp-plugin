/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import PriceChoices from '@scripts/blocks/components/PriceChoices';

export default ({ attributes, setAttributes }) => {
	const { prices } = attributes;

	const removeChoice = (index) => {
		setAttributes({
			prices: prices.filter((item, i) => i !== index),
		});
	};

	const updateChoice = (data, index) => {
		setAttributes({
			prices: prices.map((item, i) => {
				if (i !== index) return item;
				return {
					...item,
					...data,
				};
			}),
		});
	};

	const addProduct = () => {
		setAttributes({
			prices: [
				...(prices || []),
				{
					quantity: 1,
				},
			],
		});
	};

	return (
		<div
			css={css`
				font-size: 13px;
				padding-bottom: 8px;
			`}
		>
			<PriceChoices
				choices={prices}
				onAddProduct={addProduct}
				onUpdate={updateChoice}
				onRemove={removeChoice}
			/>
		</div>
	);
};
