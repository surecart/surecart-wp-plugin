/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Box from '../ui/Box';
import { ScButton, ScCard, ScIcon } from '@surecart/components-react';

const Card = ({
	title,
	buttonText,
	description,
	icon,
	highlighted = false,
}) => {
	return (
		<ScCard>
			<div
				css={css`
					display: flex;
					flex-direction: column;
					gap: 10px;
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
					`}
				>
					{title}
				</h3>
				<p
					css={css`
						margin: 0;
						font-size: 1em;
						font-weight: 400;
						color: var(--sc-color-gray-600);
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
					>
						{buttonText}
					</ScButton>
				</div>
			</div>
		</ScCard>
	);
};

export default () => {
	return (
		<Box
			title="Setup Guide"
			isBorderLess={false}
			hasDivider={false}
			header_action={
				<ScButton type="text" size="small" rounded>
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
					display: flex;
					justify-content: space-between;
					align-items: stretch;
					gap: var(--sc-spacing-large);
				`}
			>
				<Card
					icon="box"
					title="Create your first product"
					description="Create your first product to start selling to buyers."
					buttonText="Create product"
					highlighted
				/>
				<Card
					icon="credit-card"
					title="Connect payments"
					description="Connect to a payment gateway to start taking orders."
					buttonText="Connect now"
				/>
				<Card
					icon="arrow-up-right"
					title="Complete setup"
					description="Place a test order to experience the payment flow."
					buttonText="Test your checkout"
				/>
			</div>
		</Box>
	);
};
