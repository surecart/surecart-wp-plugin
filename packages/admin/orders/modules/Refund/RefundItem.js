/** @jsx jsx   */

/**
 * External dependencies.
 */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useEntityRecords } from '@wordpress/core-data';
import { ProgressBar } from '@wordpress/components';
import {
	ScInput,
	ScFormatNumber,
	ScCheckbox,
} from '@surecart/components-react';

/**
 * Internal dependencies.
 */
import ProductLineItem from '../../../ui/ProductLineItem';

const RefundItem = ({
	refundItem = {},
	onUpdate,
	chargeId = '',
	className = '',
}) => {
	const {
		quantity = 0,
		refundQuantity = 0,
		price = {},
		revokePurchase = false,
		restock = false,
	} = refundItem;

	const { amount = 0, currency = 'usd' } = price;
	const total = parseInt(amount || 0) * parseInt(refundQuantity || 0);

	// get the refunds.
	const { records: refunds, hasResolved } = useEntityRecords(
		'surecart',
		'refund',
		{
			context: 'edit',
			charge_ids: [chargeId],
			per_page: 100,
			expand: ['refund_items'],
		}
	);

	// Do some refunds refund items match the line item and has a revoke purchase.
	const hasRevokedPurchase = (refunds ?? []).some((refund) =>
		(refund?.refund_items?.data ?? []).some(
			(item) =>
				item?.line_item === refundItem?.id && item?.revoke_purchase
		)
	);

	// Get total refunded quantity for the line item.
	const totalRefundedQuantity = (refunds ?? []).reduce(
		(totalQuantity, refund) => {
			const alreadyRefundedItem = (refund?.refund_items?.data ?? []).find(
				(item) => item?.line_item === refundItem?.id
			);
			return totalQuantity + (alreadyRefundedItem?.quantity || 0);
		},
		0
	);

	const originalQuantity = quantity - totalRefundedQuantity;

	// remove line item if no quantity left.
	if (originalQuantity <= 0) {
		return null;
	}

	if (!hasResolved) {
		return <ProgressBar />;
	}

	return (
		<div
			css={css`
				padding: var(--sc-spacing-medium) 0;
				display: grid;
				gap: 0.5em;
			`}
			className={className}
		>
			<ProductLineItem
				lineItem={refundItem}
				suffix={
					<div
						css={css`
							display: flex;
							gap: 2em;
							justify-content: space-between;
							align-items: center;
							text-align: right;
							align-self: right;
						`}
					>
						<ScInput
							label={__('Quantity', 'surecart')}
							showLabel={false}
							value={refundQuantity || 0}
							max={originalQuantity || 0}
							type="number"
							min={0}
							onScInput={(e) => {
								onUpdate({
									refundQuantity: parseInt(
										e?.target?.value || 0
									),
								});
							}}
						>
							<span
								slot="suffix"
								css={css`
									opacity: 0.65;
								`}
							>
								{sprintf(
									__('of %d', 'surecart'),
									originalQuantity || 0
								)}
							</span>
						</ScInput>
						<ScFormatNumber
							css={css`
								min-width: 50px;
							`}
							type="currency"
							value={total || 0}
							currency={currency}
						/>
					</div>
				}
			/>

			<div
				css={css`
					display: flex;
					gap: 1em;
				`}
			>
				<ScCheckbox
					css={css`
						padding-top: var(--sc-spacing-large);
						padding-bottom: var(--sc-spacing-small);
					`}
					checked={!!restock}
					onScChange={(e) => {
						onUpdate({
							restock: !!e?.target?.checked,
						});
					}}
				>
					{__('Restock', 'surecart')}
				</ScCheckbox>

				{!hasRevokedPurchase && (
					<ScCheckbox
						css={css`
							padding-top: var(--sc-spacing-large);
							padding-bottom: var(--sc-spacing-small);
						`}
						checked={!!revokePurchase}
						onScChange={(e) => {
							onUpdate({
								revokePurchase: !!e?.target?.checked,
							});
						}}
					>
						{__('Revoke Purchase', 'surecart')}
					</ScCheckbox>
				)}
			</div>
		</div>
	);
};

export default RefundItem;
