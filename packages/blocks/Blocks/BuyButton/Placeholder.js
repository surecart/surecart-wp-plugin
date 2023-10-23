/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Placeholder, Button } from '@wordpress/components';

import { button as icon } from '@wordpress/icons';

import PriceChoices from '@scripts/blocks/components/PriceChoices';

export default ({ setAttributes }) => {
	const [line_items, setLineItems] = useState([]);

	const removeLineItem = (index) => {
		setLineItems(line_items.filter((_, i) => i !== index));
	};

	const updateLineItem = (data) => {
		const existingPrice = line_items?.find((item) => {
			return item?.id === data.id && !data?.variant_id;
		});
		const existingVariant = line_items?.find(
			(item) =>
				item?.id === data.id && item?.variant_id === data.variant_id
		);

		// increase quantity if variant exists.
		if (existingVariant) {
			setLineItems(
				line_items.map((item) => {
					if (item?.id !== existingVariant?.id) return item;
					return {
						...item,
						...{
							quantity: existingVariant?.quantity + 1,
						},
					};
				})
			);
			return;
		}

		// increase price if price exists.
		if (existingPrice) {
			setLineItems(
				line_items.map((item) => {
					if (item?.id !== existingPrice?.id) return item;
					return {
						...item,
						...{
							quantity: existingPrice?.quantity + 1,
						},
					};
				})
			);
			return;
		}

		setLineItems([
			...line_items,
			{
				...data,
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
