/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Box from '../ui/Box';
import { ScButton, ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as preferencesStore } from '@wordpress/preferences';
import Card from './components/Card';
import { store as noticesStore } from '@wordpress/notices';

export default () => {
	const { set } = useDispatch(preferencesStore);
	const { createErrorNotice } = useDispatch(noticesStore);
	const hideGetStarted = useSelect((select) =>
		select(preferencesStore).get('surecart/dashboard', 'hideGetStarted')
	);
	const removeGetStarted = () => {
		set('surecart/dashboard', 'hideGetStarted', true);
	};

	const { product } = useSelect((select) => {
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
					aria-label={__('Close setup guide', 'surecart')}
				>
					<ScIcon
						name="x"
						aria-hidden="true"
						css={css`
							font-size: 18px;
						`}
					/>
				</ScButton>
			}
			footer={
				<a
					href="admin.php?page=sc-learn"
					css={css`
						display: flex;
						align-items: center;
						gap: var(--sc-spacing-medium, 16px);
						width: 100%;
						text-decoration: none;
						color: inherit;

						&:hover,
						&:focus,
						&:active,
						&:visited {
							color: inherit;
							text-decoration: none;
						}

						@media (max-width: 640px) {
							flex-direction: column;
							text-align: center;
						}
					`}
				>
					<ScIcon
						name="book-open"
						css={css`
							font-size: 24px;
							color: var(--sc-color-brand-secondary);
							flex-shrink: 0;
						`}
					/>
					<div
						css={css`
							flex: 1;
							display: flex;
							flex-direction: column;
							gap: 2px;
						`}
					>
						<span
							css={css`
								font-size: 1em;
								font-weight: 600;
								line-height: 1.4;
							`}
						>
							{__('Want a complete guided walkthrough?', 'surecart')}
						</span>
						<span
							css={css`
								font-size: 0.95em;
								font-weight: 400;
								color: var(--sc-color-gray-600);
								line-height: 1.5;
							`}
						>
							{__('Learn SureCart step by step.', 'surecart')}
						</span>
					</div>
					<span
						css={css`
							white-space: nowrap;
							color: var(--sc-color-brand-primary);
							font-weight: 600;
							font-size: 0.95em;
							flex-shrink: 0;
						`}
					>
						{__('Start learning', 'surecart')} &rarr;
					</span>
				</a>
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
					onClick={(e) => {
						if (product?.permalink) {
							return true;
						}
						e.preventDefault();
						createErrorNotice(
							__(
								'You must first create a product to test your checkout.',
								'surecart'
							),
							{ type: 'snackbar' }
						);
					}}
					buttonText={__('Test your checkout', 'surecart')}
				/>
			</div>
		</Box>
	);
};
