/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
	ScFormControl,
	ScSkeleton,
	ScInput,
	ScIcon,
	ScMenuItem,
	ScMenuLabel,
} from '@surecart/components-react';
import { ExternalLink } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import PriceSelector from '@admin/components/PriceSelector';
import SwapPriceDisplay from './SwapPriceDisplay';
import HelpTooltip from '../../../../components/HelpTooltip';

export default ({
	price,
	swapPrice,
	swapPriceDescription,
	updateSwap,
	onDelete,
	loading,
	currentProduct,
}) => {
	if (loading) {
		return <ScSkeleton />;
	}

	const renderPriorityProductPrice = () => {
		const otherProductPrices = currentProduct?.active_prices?.filter(
			(priceItem) => priceItem.id !== price?.id
		);

		if (!otherProductPrices?.length) {
			return null;
		}

		return (
			<span slot="prefix">
				<ScMenuLabel key={currentProduct?.id}>
					{currentProduct?.name} {__('(Current Product)', 'surecart')}
				</ScMenuLabel>
				{otherProductPrices.map((priceItem) => {
					return (
						<ScMenuItem
							key={priceItem?.id}
							checked={swapPrice?.id === priceItem?.id}
							value={priceItem?.id}
							onClick={() =>
								updateSwap({
									price: price?.id,
									swap_price: priceItem?.id,
								})
							}
							onKeyDown={(event) => {
								if (
									event.key === 'Enter' ||
									event.key === ' '
								) {
									event.preventDefault();
									event.stopImmediatePropagation();
									updateSwap({
										price: price?.id,
										swap_price: priceItem?.id,
									});
								}
							}}
							aria-label={priceItem?.name}
							aria-selected={
								swapPrice?.id === priceItem?.id
									? 'true'
									: 'false'
							}
							role="option"
						>
							{priceItem?.display_amount}
							<div slot="suffix">
								{priceItem?.interval_text}
								{currentProduct?.stock_enabled ? (
									<div
										css={css`
											font-size: var(
												--sc-input-help-text-font-size-medium
											);
											opacity: 0.65;
										`}
									>
										{sprintf(
											__('%s available', 'surecart'),
											currentProduct?.available_stock
										)}
									</div>
								) : null}
							</div>
						</ScMenuItem>
					);
				})}
			</span>
		);
	};

	if (!swapPrice) {
		return (
			<ScFormControl
				label={__('Swap to', 'surecart')}
				help={__(
					'The associated price the customer can swap to on the checkout.',
					'surecart'
				)}
			>
				<HelpTooltip
					content={
						<div>
							<p style={{ marginTop: 0 }}>
								{__(
									'Price boost is only available for products without variants.',
									'surecart'
								)}
							</p>
							<ExternalLink
								href="https://docs.surecart.com"
								target="_blank"
							>
								{__('Learn More', 'surecart')}
							</ExternalLink>
						</div>
					}
					position="top left"
					slot="label-end"
				>
					<ScIcon name="info" style={{ opacity: 0.5 }} />
				</HelpTooltip>
				<PriceSelector
					value={swapPrice?.id}
					onSelect={({ price_id }) =>
						updateSwap({
							price: price?.id,
							swap_price: price_id,
						})
					}
					showOutOfStock={true}
					requestQuery={{
						archived: false,
					}}
					includeVariants={false}
					variable={false}
					placement="top-start"
					position="top-left"
					exclude={[price?.id]}
					prefix={renderPriorityProductPrice()}
					hidePrefixOnSearch={true}
					excludeProducts={[price?.product?.id]}
				/>
			</ScFormControl>
		);
	}

	return (
		<>
			<ScFormControl
				label={__('Swap to', 'surecart')}
				help={__(
					'The associated price the customer can swap to on the checkout.',
					'surecart'
				)}
			>
				<HelpTooltip
					content={
						<div>
							<p style={{ marginTop: 0 }}>
								{__(
									'Price boost is only available for products without variants.',
									'surecart'
								)}
							</p>
							<ExternalLink
								href="https://docs.surecart.com"
								target="_blank"
							>
								{__('Learn More', 'surecart')}
							</ExternalLink>
						</div>
					}
					position="top left"
					slot="label-end"
				>
					<ScIcon name="info" style={{ opacity: 0.5 }} />
				</HelpTooltip>
				<SwapPriceDisplay
					price={swapPrice}
					product={swapPrice?.product}
					onRemove={onDelete}
				/>
			</ScFormControl>
			<ScFormControl
				label={__('Description', 'surecart')}
				required
				help={__(
					'This is shown to the customer on line items to help them understand the price boost.',
					'surecart'
				)}
			>
				<ScInput
					placeholder={__('i.e. Pay yearly and save 20%', 'surecart')}
					value={swapPriceDescription}
					onScInput={(e) =>
						updateSwap({ description: e.target.value })
					}
					required
				/>
			</ScFormControl>
		</>
	);
};
