/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import PriceSelector from '@admin/components/PriceSelector';
import { ScButton, ScIcon, ScInput } from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';

export default () => {
	const { checkout, addLineItem, updateLineItem } = useInvoice();
	const [price, setPrice] = useState(false);

	useEffect(() => {
		const { priceId, variantId } = price;
		if (priceId) {
			onSubmit(priceId, variantId ?? null);
		}
	}, [price]);

	const onSubmit = async (priceId, variantId = null) => {
		const matchedLineItem = checkout?.line_items?.data?.find(
			(item) =>
				item?.price?.id === priceId && item?.variant?.id === variantId
		);

		if (matchedLineItem) {
			updateLineItem(matchedLineItem.id, {
				quantity: matchedLineItem.quantity + 1,
			});
		} else {
			addLineItem({
				checkout: checkout?.id,
				price: priceId,
				quantity: 1,
				variant: variantId,
			});
		}

		setPrice(false);
	};

	return (
		<PriceSelector
			ad_hoc={true}
			onSelect={({ price_id, variant_id }) => {
				setPrice({
					priceId: price_id,
					variantId: variant_id,
				});
			}}
			requestQuery={{
				archived: false,
			}}
		>
			{!checkout?.line_items?.data?.length && (
				<ScInput
					slot="trigger"
					required
					css={css`
						width: 0;
						height: 0;
						opacity: 0;
						overflow: hidden;
					`}
				/>
			)}
			<ScButton
				slot="trigger"
				type={
					checkout?.line_items?.data?.length ? 'default' : 'primary'
				}
			>
				<ScIcon name="plus" slot="prefix" />
				{__('Add Product', 'surecart')}
			</ScButton>
		</PriceSelector>
	);
};
