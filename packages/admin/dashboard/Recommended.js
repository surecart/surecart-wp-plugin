/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Box from '../ui/Box';
import { ScButton, ScCard, ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default () => {
	return (
		<Box
			title={__('Setup Guide', 'surecart')}
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
