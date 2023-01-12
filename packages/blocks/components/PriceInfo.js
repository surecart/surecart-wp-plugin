/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import { Spinner, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { intervalString } from '../../admin/util/translations';

export default ({ price_id }) => {
	const { price, product, loading } = useSelect((select) => {
		const queryArgs = [
			'root',
			'price',
			price_id,
			{
				expand: ['product'],
			},
		];
		const price = select(coreStore).getEntityRecord(...queryArgs);
		return {
			price,
			product: price?.product,
			loading: select(coreStore).isResolving(
				'getEntityRecord',
				queryArgs
			),
		};
	});

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
					<>
						<sc-format-number
							type="currency"
							currency={price?.currency}
							value={price?.amount}
						></sc-format-number>{' '}
						{intervalString(price)}
					</>
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
