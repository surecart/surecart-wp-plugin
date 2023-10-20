/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Placeholder, Button } from '@wordpress/components';

import { button as icon, login } from '@wordpress/icons';

import PriceChoices from '@scripts/blocks/components/PriceChoices';

export default ({ setAttributes }) => {
	const [line_items, setLineItems] = useState([{ quantity: 1 }]);

	const removeLineItem = (index) => {
		setLineItems(line_items.filter((_, i) => i !== index));
	};

	const updateLineItem = (data, index) => {
		const priceExists = line_items.find((item) => {
			return item?.id && item.id === data.id;
		});
		const variantExists = line_items.find((item) => {
			return (
				item?.id &&
				item.id === data.id &&
				item.variant_id &&
				item.variant_id === data.variant_id
			);
		});

		if (variantExists) {
			removeLineItem(index);
			setLineItems(
				line_items.map((item) => {
					if (
						item?.id !== variantExists?.id ||
						item?.variant_id !== variantExists?.variant_id
					) {
						return item;
					}
					return {
						...item,
						...{
							quantity: variantExists?.quantity + 1,
						},
					};
				})
			);
			return;
		}
		if (priceExists) {
			removeLineItem(index);
			setLineItems(
				line_items.map((item) => {
					if (item?.id !== priceExists?.id) return item;
					return {
						...item,
						...{
							quantity: priceExists?.quantity + 1,
						},
					};
				})
			);
			return;
		}
		setLineItems(
			line_items.map((item, i) => {
				if (i !== index) return item;
				return {
					...item,
					...data,
				};
			})
		);
	};

	const addLineItem = () => {
		setLineItems([
			...(line_items || []),
			{
				quantity: 1,
			},
		]);
	};

	return (
		<Placeholder icon={icon} label={__('Select some products', 'surecart')}>
			<div
				css={css`
					display: grid;
					gap: 0.5em;
					width: 100%;
				`}
			>
				<PriceChoices
					choices={line_items}
					onAddProduct={addLineItem}
					onUpdate={updateLineItem}
					onRemove={removeLineItem}
					onNew={() => {}}
				/>
				<hr />
				<div
					css={css`
						display: flex;
						justify-content: flex-end;
					`}
				>
					<Button
						variant="primary"
						onClick={() => setAttributes({ line_items })}
					>
						{__('Create Buy Button', 'surecart')}
					</Button>
				</div>
			</div>
		</Placeholder>
	);
};
