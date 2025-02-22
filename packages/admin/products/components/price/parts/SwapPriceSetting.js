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
import { useEntityRecord } from '@wordpress/core-data';
import { intervalString } from '../../../../util/translations';
import { formatNumber } from '../../../../util';

export default ({
	price,
	swapPrice,
	swapPriceDescription,
	updateSwap,
	onDelete,
	loading,
}) => {
	if (loading) {
		return <ScSkeleton />;
	}

	const { record: product } = useEntityRecord(
		'surecart',
		'product',
		price?.product?.id || price?.product
	);

	const renderPriorityProductPrice = () => {
		return (
			<span slot="prefix">
				<ScMenuLabel key={product?.id}>{product?.name}</ScMenuLabel>
				{(product?.prices?.data || [])
					.filter((priceItem) => !priceItem?.archived)
					.filter((priceItem) => priceItem.id !== price?.id)
					.map((priceItem) => {
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
								{`${formatNumber(
									priceItem.amount,
									priceItem.currency
								)}${priceItem?.archived ? ' (Archived)' : ''}`}
								<div slot="suffix">
									{intervalString(priceItem, {
										showOnce: true,
									})}{' '}
									{product?.stock_enabled
										? sprintf(
												__('%s available', 'surecart'),
												product?.available_stock
										  )
										: null}
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
