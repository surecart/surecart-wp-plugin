/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScIcon, ScTag } from '@surecart/components-react';
import DrawerSection from '../../../../ui/DrawerSection';
import HelpTooltip from '../../../../components/HelpTooltip';
import SwapPrice from './SwapPrice';
import { ExternalLink } from '@wordpress/components';

const Swap = ({ currentPrice, updateSwap, currentSwap, isSaving }) => {
	return (
		<DrawerSection
			title={
				<div
					css={css`
						display: flex;
						gap: 1em;
					`}
				>
					{__('Price Boost', 'surecart')}{' '}
					<HelpTooltip
						content={
							<div>
								<strong>{__('Price Boost', 'surecart')}</strong>
								<p>
									{__(
										'Increase your average order value by allowing customers to upgrade a price in their order with a single click.',
										'surecart'
									)}
								</p>
								<ExternalLink
									href="https://docs.surecart.com/docs/pricing/price-upsell"
									target="_blank"
								>
									{__('Learn More', 'surecart')}
								</ExternalLink>
							</div>
						}
						position="top"
					>
						<ScTag
							type="primary"
							pill
							size="small"
							style={{
								'--sc-tag-primary-background-color':
									'var(--sc-color-primary-50)',
								'--sc-tag-primary-border-color':
									'var(--sc-color-primary-700)',
								'--sc-tag-primary-color':
									'var(--sc-color-primary-800)',
							}}
						>
							<div
								css={css`
									padding: 1px 2px;
									display: flex;
									align-items: center;
									gap: 0.5em;
								`}
							>
								<ScIcon name="trending-up" />
								{__('Boost Revenue', 'surecart')}
							</div>
						</ScTag>
					</HelpTooltip>
				</div>
			}
			highlight={!currentSwap}
		>
			<SwapPrice
				price={currentPrice}
				updateSwap={updateSwap}
				currentSwap={currentSwap}
				isSaving={isSaving}
			/>
		</DrawerSection>
	);
};

export default Swap;
