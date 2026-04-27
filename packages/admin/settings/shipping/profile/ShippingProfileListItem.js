/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __, sprintf, _n } from '@wordpress/i18n';
import { ScIcon, ScStackedListRow } from '@surecart/components-react';
import { useLink, useLocation } from '../../../router';

export default ({ shippingProfile, productsCount, className, style }) => {
	const location = useLocation();
	const { href, onClick } = useLink({
		...location.params,
		type: 'shipping_profile',
		profile: shippingProfile.id,
	});

	return (
		<ScStackedListRow
			className={className}
			href={href}
			onClick={onClick}
			style={{
				'--columns': '2',
				...style,
			}}
		>
			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-x-small);
				`}
			>
				<strong>{shippingProfile.name}</strong>
				<div
					css={css`
						color: var(--sc-color-gray-600);
					`}
				>
					{productsCount
						? productsCount
						: sprintf(
								_n(
									'%d product',
									'%d products',
									shippingProfile?.products?.pagination
										?.count,
									'surecart'
								),
								shippingProfile?.products?.pagination?.count
						  )}
				</div>
			</div>

			<div>
				<strong>{__('Rates for', 'surecart')}</strong>
				<ul
					css={css`
						list-style: none;
						margin: var(--sc-spacing-x-small) 0 0 0;
						color: var(--sc-color-gray-600);
					`}
				>
					{shippingProfile?.shipping_zones?.data.length === 0 && (
						<li>
							{__(
								'No shipping rates available for customers to choose from.',
								'surecart'
							)}
						</li>
					)}
					{shippingProfile?.shipping_zones?.data.map(
						(shippingZone) => (
							<li key={shippingZone.id}>{shippingZone.name}</li>
						)
					)}
				</ul>
			</div>

			<ScIcon name="chevron-right" slot="suffix"></ScIcon>
		</ScStackedListRow>
	);
};
