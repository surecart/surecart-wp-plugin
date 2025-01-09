/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { Spinner, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { intervalString } from '../../admin/util/translations';
import LineItemLabel from '../../admin/ui/LineItemLabel';
import { ScFormatNumber } from '@surecart/components-react';

export default ({ price_id, variant_id }) => {
	const { price, product, variant, loading } = useSelect(
		(select) => {
			const queryArgs = ['surecart', 'price', price_id];
			const price = select(coreStore).getEntityRecord(...queryArgs);
			const product = select(coreStore).getEntityRecord(
				'surecart',
				'product',
				price?.product
			);

			const variant = !!variant_id
				? select(coreStore).getEntityRecord(
						'surecart',
						'variant',
						variant_id
				  )
				: null;

			return {
				price,
				variant,
				product,
				loading: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[price_id, variant_id]
	);

	if (loading) {
		return <Spinner />;
	}

	if (!price) {
		return null;
	}

	return (
		<div>
			<h3
				css={css`
					margin: 0 !important;
				`}
			>
				{product?.name}
			</h3>
			<p
				css={css`
					opacity: 0.75;
				`}
			>
				{price?.ad_hoc ? (
					__('Name Your Price', 'surecart')
				) : (
					<LineItemLabel
						lineItem={{
							price,
							variant_options: [
								variant?.option_1,
								variant?.option_2,
								variant?.option_3,
							],
						}}
					>
						<div>
							<ScFormatNumber
								type="currency"
								currency={price?.currency || 'usd'}
								value={
									!!price?.ad_hoc && price?.ad_hoc_amount
										? price?.ad_hoc_amount
										: price?.amount
								}
							/>
							{intervalString(price)}
						</div>
					</LineItemLabel>
				)}
			</p>
			<Button
				href={addQueryArgs('admin.php', {
					page: 'sc-products',
					action: 'edit',
					id: product?.id,
				})}
				isSecondary
			>
				{__('Edit Product', 'surecart')}
			</Button>
		</div>
	);
};
