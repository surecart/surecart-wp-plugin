/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Box from '../ui/Box';
import { ScButton, ScCard, ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';

const Card = ({
	title,
	buttonText,
	description,
	icon,
	highlighted = false,
}) => {
	return (
		<ScCard
			css={css`
				height: 100%;
			`}
		>
			<div
				css={css`
					display: flex;
					flex-direction: column;
					gap: 10px;
					height: 100%;
				`}
			>
				<ScIcon
					name={icon}
					style={{
						'font-size': '24px',
						color: 'var(--sc-color-brand-secondary)',
						margin: 0,
						marginBottom: '6px',
					}}
				/>
				<h3
					css={css`
						margin: 0;
						font-size: 1em;
						line-height: 1.4;
					`}
				>
					{title}
				</h3>
				<p
					css={css`
						margin: 0;
						font-size: 0.95em;
						font-weight: 400;
						color: var(--sc-color-gray-600);
						line-height: 1.5;
						flex-grow: 1;
					`}
				>
					{description}
				</p>
				<div
					css={css`
						margin-top: 6px;
					`}
				>
					<ScButton
						type={highlighted ? 'primary' : 'default'}
						style={{
							'--primary-background':
								'var(--sc-brand-color-background-inverse)',
						}}
						css={css`
							width: 100%;

							@media (min-width: 640px) {
								width: auto;
							}
						`}
					>
						{buttonText}
					</ScButton>
				</div>
			</div>
		</ScCard>
	);
};

export default () => {
	const { set } = useDispatch(preferencesStore);
	const hideGetStarted = useSelect((select) =>
		select(preferencesStore).get('surecart/dashboard', 'hideGetStarted')
	);
	const removeGetStarted = () => {
		set('surecart/dashboard', 'hideGetStarted', true);
	};

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
					highlighted
				/>
				<Card
					icon="credit-card"
					title={__('Connect payments', 'surecart')}
					description={__(
						'Connect to a payment gateway to start taking orders.',
						'surecart'
					)}
					buttonText={__('Connect now', 'surecart')}
				/>
				<Card
					icon="arrow-up-right"
					title={__('Complete setup', 'surecart')}
					description={__(
						'Place a test order to experience the payment flow.',
						'surecart'
					)}
					buttonText={__('Test your checkout', 'surecart')}
				/>
			</div>
		</Box>
	);
};
