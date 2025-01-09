/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import {
	PanelBody,
	PanelRow,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { ScPriceInput, ScText } from '@surecart/components-react';

export default ({ setAttributes, line_items, amount, amount_placement }) => {
	const lineItem = line_items[0] ?? null;
	if (!lineItem) {
		return;
	}

	const { id: price_id, variant_id } = lineItem;

	const amountPlacements = [
		{
			value: 'none',
			label: __('None', 'surecart'),
		},
		{
			value: 'before',
			label: __('Before', 'surecart'),
		},
		{
			value: 'after',
			label: __('After', 'surecart'),
		},
	];

	const { price, variant } = useSelect(
		(select) => {
			const queryArgs = ['surecart', 'price', price_id];
			const price = select(coreStore).getEntityRecord(...queryArgs);
			const variant = !!variant_id
				? select(coreStore).getEntityRecord(
						'surecart',
						'variant',
						variant_id
				  )
				: null;

			return {
				price,
				variant,
				loading: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[price_id, variant_id]
	);

	// The useEffect hook is used to update the amount attribute when the price object is updated.
	useEffect(() => {
		if (!!price?.id) {
			setAttributes({
				amount: price?.ad_hoc
					? amount ?? variant?.amount ?? price?.amount
					: variant?.amount ?? price?.amount,
			});
		}
	}, [price]);

	return (
		<PanelBody title={__('Amount Settings', 'surecart')}>
			{price?.ad_hoc && (
				<PanelRow
					css={css`
						flex-direction: column;
						gap: 10px;
						justify-content: flex-start;
						align-items: flex-start;
					`}
				>
					<ScPriceInput
						label={__('Custom Amount', 'surecart')}
						placeholder={__('Enter Custom Amount', 'surecart')}
						currencyCode={scData.currency}
						value={amount ?? price?.ad_hoc_amount}
						onScInput={(e) => {
							setAttributes({
								amount: e.target.value,
							});
						}}
						css={css`
							text-transform: uppercase;
						`}
					/>

					<ScText
						as="p"
						css={css`
							margin-bottom: var(--sc-spacing-medium);
							color: var(--sc-color-gray-500);
						`}
					>
						{__(
							'If you want to show a custom amount for ad hoc pricing, you can set it here.',
							'surecart'
						)}
					</ScText>
				</PanelRow>
			)}

			<ToggleGroupControl
				label={__('Amount Placement', 'surecart')}
				value={amount_placement}
				onChange={(value) =>
					setAttributes({
						amount_placement: value,
					})
				}
				css={css`
					border: 1px solid;
				`}
			>
				{amountPlacements.map(({ value, icon, label }) => {
					return (
						<ToggleGroupControlOption
							key={value}
							value={value}
							icon={icon}
							label={label}
						/>
					);
				})}
			</ToggleGroupControl>
		</PanelBody>
	);
};
