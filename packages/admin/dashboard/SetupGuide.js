/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Box from '../ui/Box';
import { ScButton, ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as preferencesStore } from '@wordpress/preferences';
import Card from './components/Card';

export default () => {
	const { set } = useDispatch(preferencesStore);
	const hideGetStarted = useSelect((select) =>
		select(preferencesStore).get('surecart/dashboard', 'hideGetStarted')
	);
	const removeGetStarted = () => {
		set('surecart/dashboard', 'hideGetStarted', true);
	};

	const { product, loading } = useSelect((select) => {
		const queryArgs = [
			'surecart',
			'product',
			{
				ad_hoc: false,
				archived: false,
				status: ['published'],
				per_page: 1,
			},
		];
		return {
			product: select(coreStore).getEntityRecords(...queryArgs)?.[0],
			loading: select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			),
		};
	});

	if (hideGetStarted) {
		return null;
	}

	return (
		<Box
			title={__('Setup Guide', 'surecart')}
			isBorderLess={false}
			hasDivider={false}
			header_action={
				<ScButton
					type="text"
					size="small"
					rounded
					onClick={removeGetStarted}
				>
					<ScIcon
						name="x"
						css={css`
							font-size: 18px;
						`}
					/>
				</ScButton>
			}
		>
			<div
				css={css`
					display: grid;
					grid-template-columns: 1fr;
					gap: var(--sc-spacing-medium);

					@media (min-width: 640px) {
						grid-template-columns: repeat(2, 1fr);
						gap: var(--sc-spacing-large);
					}

					@media (min-width: 1024px) {
						grid-template-columns: repeat(3, 1fr);
					}
				`}
			>
				<Card
					icon="box"
					title={__('Create your first product', 'surecart')}
					description={__(
						'Create your first product to start selling to buyers.',
						'surecart'
					)}
					buttonText={__('Create product', 'surecart')}
					href="admin.php?page=sc-products&action=edit"
					highlighted
				/>
				<Card
					icon="credit-card"
					title={__('Connect payments', 'surecart')}
					description={__(
						'Connect to a payment gateway to start taking orders.',
						'surecart'
					)}
					href="admin.php?page=sc-settings&tab=processors"
					buttonText={__('Connect now', 'surecart')}
				/>
				<Card
					icon="arrow-up-right"
					title={__('Complete setup', 'surecart')}
					description={__(
						'Place a test order to experience the payment flow.',
						'surecart'
					)}
					href={product?.permalink ?? null}
					buttonText={__('Test your checkout', 'surecart')}
				/>
			</div>
		</Box>
	);
};
