/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { _n, sprintf, __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScFlex, ScFormatNumber, ScIcon } from '@surecart/components-react';
import { getFeaturedProductMediaAttributes } from '@surecart/components';
import { intervalString } from '../../../../util/translations';

export default ({ product }) => {
	const activePrices = product?.prices?.data?.filter(
		(price) => !price?.archived
	);

	const firstPrice = activePrices?.[0];
	const totalPrices = activePrices?.length;
	const media = getFeaturedProductMediaAttributes(product);

	return (
		<ScFlex alignItems="center" justifyContent="flex-start">
			{media.url ? (
				<img
					src={media.url}
					alt={media.alt}
					{...(media.title ? { title: media.title } : {})}
					css={css`
						width: 40px;
						height: 40px;
						object-fit: cover;
						background: #f3f3f3;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: var(--sc-border-radius-small);
					`}
				/>
			) : (
				<div
					css={css`
						width: 40px;
						height: 40px;
						object-fit: cover;
						background: var(--sc-color-gray-100);
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: var(--sc-border-radius-small);
					`}
				>
					<ScIcon
						style={{
							width: '18px',
							height: '18px',
						}}
						name={'image'}
					/>
				</div>
			)}
			<div>
				<div>
					<strong>{product?.name}</strong>
				</div>
				{totalPrices > 1 ? (
					sprintf(__('%d prices', 'surecart'), totalPrices)
				) : (
					<>
						<ScFormatNumber
							value={firstPrice?.amount}
							type="currency"
							currency={firstPrice?.currency}
						/>
						{intervalString(firstPrice)}
					</>
				)}
			</div>
		</ScFlex>
	);
};
