/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScFlex, ScRadioGroup, ScRadio } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import Error from '../../components/Error';
import SettingsBox from '../SettingsBox';
import SettingsTemplate from '../SettingsTemplate';
import useSave from '../UseSave';
import useEntity from '../../hooks/useEntity';

export default () => {
	const [error, setError] = useState(null);
	const { save } = useSave();

	const { item, itemError, editItem, hasLoadedItem } = useEntity(
		'store',
		'auto_fee_protocol'
	);

	/**
	 * Form is submitted.
	 */
	const onSubmit = async () => {
		setError(null);
		try {
			await save({
				successMessage: __('Settings Updated.', 'surecart'),
			});
		} catch (e) {
			console.error(e);
			setError(e);
		}
	};

	const VALUE_PHRASE = {
		all: __('All applicable %ss', 'surecart'),
		first: __('The first applicable %s', 'surecart'),
		biggest: __('The biggest applicable %s', 'surecart'),
		lowest: __('The lowest applicable %s', 'surecart'),
	};

	const TARGET_PHRASE = {
		checkout: __('at checkout', 'surecart'),
		line_item: __('to the line item', 'surecart'),
		shipping: __('to shipping', 'surecart'),
	};

	const getHelpText = (
		value = 'all',
		type = 'discount',
		target = 'checkout'
	) => {
		if (!VALUE_PHRASE[value] || !TARGET_PHRASE[target]) {
			return '';
		}

		return sprintf(
			__('%s will be applied %s.', 'surecart'),
			sprintf(VALUE_PHRASE[value], type),
			TARGET_PHRASE[target]
		);
	};

	return (
		<SettingsTemplate
			title={__('Dynamic Pricing Settings', 'surecart')}
			icon={<sc-icon name="badge-percent"></sc-icon>}
			onSubmit={onSubmit}
		>
			<Error
				error={itemError || error}
				setError={setError}
				margin="80px"
			/>

			<SettingsBox
				title={__('Fees Selection Strategy', 'surecart')}
				description={__('Selection Strategy', 'surecart')}
				loading={!hasLoadedItem}
			>
				<ScRadioGroup
					label={__('Checkout', 'surecart')}
					onScChange={(e) =>
						editItem({
							negative_checkout_fee_selection_strategy:
								e.target.value,
						})
					}
					help={__('Checkout selection strategy.', 'surecart')}
				>
					<ScFlex
						style={{
							'--sc-flex-column-gap': '1.5em',
							'--sc-flex-space-between': 'flex-start',
						}}
					>
						<ScRadio
							value="all"
							checked={
								'all' ===
								item?.negative_checkout_fee_selection_strategy
							}
						>
							{__('All', 'surecart')}
						</ScRadio>
						<ScRadio
							value="first"
							checked={
								'first' ===
								item?.negative_checkout_fee_selection_strategy
							}
						>
							{__('First', 'surecart')}
						</ScRadio>
						<ScRadio
							value="biggest"
							checked={
								'biggest' ===
								item?.negative_checkout_fee_selection_strategy
							}
						>
							{__('Biggest', 'surecart')}
						</ScRadio>
						<ScRadio
							value="lowest"
							checked={
								'lowest' ===
								item?.negative_checkout_fee_selection_strategy
							}
						>
							{__('Lowest', 'surecart')}
						</ScRadio>
					</ScFlex>
					<div
						style={{
							opacity: '0.85',
							marginTop: 'var(--sc-input-label-margin)',
							color: 'var(--sc-color-gray-500)',
							fontSize: 'var(--sc-font-size-medium)',
						}}
					>
						{getHelpText(
							item?.negative_checkout_fee_selection_strategy,
							'fee',
							'checkout'
						)}
					</div>
				</ScRadioGroup>
				<ScRadioGroup
					label={__('Line Item', 'surecart')}
					onScChange={(e) =>
						editItem({
							negative_line_item_fee_selection_strategy:
								e.target.value,
						})
					}
					help={__('Line Item selection strategy.', 'surecart')}
				>
					<ScFlex
						style={{
							'--sc-flex-column-gap': '1.5em',
							'--sc-flex-space-between': 'flex-start',
						}}
					>
						<ScRadio
							value="all"
							checked={
								'all' ===
								item?.negative_line_item_fee_selection_strategy
							}
						>
							{__('All', 'surecart')}
						</ScRadio>
						<ScRadio
							value="first"
							checked={
								'first' ===
								item?.negative_line_item_fee_selection_strategy
							}
						>
							{__('First', 'surecart')}
						</ScRadio>
						<ScRadio
							value="biggest"
							checked={
								'biggest' ===
								item?.negative_line_item_fee_selection_strategy
							}
						>
							{__('Biggest', 'surecart')}
						</ScRadio>
						<ScRadio
							value="lowest"
							checked={
								'lowest' ===
								item?.negative_line_item_fee_selection_strategy
							}
						>
							{__('Lowest', 'surecart')}
						</ScRadio>
					</ScFlex>
					<div
						style={{
							opacity: '0.85',
							marginTop: 'var(--sc-input-label-margin)',
							color: 'var(--sc-color-gray-500)',
							fontSize: 'var(--sc-font-size-medium)',
						}}
					>
						{getHelpText(
							item?.negative_line_item_fee_selection_strategy,
							'fee',
							'line_item'
						)}
					</div>
				</ScRadioGroup>
				<ScRadioGroup
					label={__('Shipping', 'surecart')}
					onScChange={(e) =>
						editItem({
							negative_shipping_fee_selection_strategy:
								e.target.value,
						})
					}
					help={__('Shipping selection strategy.', 'surecart')}
				>
					<ScFlex
						style={{
							'--sc-flex-column-gap': '1.5em',
							'--sc-flex-space-between': 'flex-start',
						}}
					>
						<ScRadio
							value="all"
							checked={
								'all' ===
								item?.negative_shipping_fee_selection_strategy
							}
						>
							{__('All', 'surecart')}
						</ScRadio>
						<ScRadio
							value="first"
							checked={
								'first' ===
								item?.negative_shipping_fee_selection_strategy
							}
						>
							{__('First', 'surecart')}
						</ScRadio>
						<ScRadio
							value="biggest"
							checked={
								'biggest' ===
								item?.negative_shipping_fee_selection_strategy
							}
						>
							{__('Biggest', 'surecart')}
						</ScRadio>
						<ScRadio
							value="lowest"
							checked={
								'lowest' ===
								item?.negative_shipping_fee_selection_strategy
							}
						>
							{__('Lowest', 'surecart')}
						</ScRadio>
					</ScFlex>
					<div
						style={{
							opacity: '0.85',
							marginTop: 'var(--sc-input-label-margin)',
							color: 'var(--sc-color-gray-500)',
							fontSize: 'var(--sc-font-size-medium)',
						}}
					>
						{getHelpText(
							item?.negative_shipping_fee_selection_strategy,
							'fee',
							'shipping'
						)}
					</div>
				</ScRadioGroup>
			</SettingsBox>
			<SettingsBox
				title={__('Discount Selection Strategy', 'surecart')}
				description={__('Selection Strategy', 'surecart')}
				loading={!hasLoadedItem}
			>
				<ScRadioGroup
					label={__('Checkout', 'surecart')}
					onScChange={(e) =>
						editItem({
							positive_checkout_fee_selection_strategy:
								e.target.value,
						})
					}
					help={__('Checkout selection strategy.', 'surecart')}
				>
					<ScFlex
						style={{
							'--sc-flex-column-gap': '1.5em',
							'--sc-flex-space-between': 'flex-start',
						}}
					>
						<ScRadio
							value="all"
							checked={
								'all' ===
								item?.positive_checkout_fee_selection_strategy
							}
						>
							{__('All', 'surecart')}
						</ScRadio>
						<ScRadio
							value="first"
							checked={
								'first' ===
								item?.positive_checkout_fee_selection_strategy
							}
						>
							{__('First', 'surecart')}
						</ScRadio>
						<ScRadio
							value="biggest"
							checked={
								'biggest' ===
								item?.positive_checkout_fee_selection_strategy
							}
						>
							{__('Biggest', 'surecart')}
						</ScRadio>
						<ScRadio
							value="lowest"
							checked={
								'lowest' ===
								item?.positive_checkout_fee_selection_strategy
							}
						>
							{__('Lowest', 'surecart')}
						</ScRadio>
					</ScFlex>
					<div
						style={{
							opacity: '0.85',
							marginTop: 'var(--sc-input-label-margin)',
							color: 'var(--sc-color-gray-500)',
							fontSize: 'var(--sc-font-size-medium)',
						}}
					>
						{getHelpText(
							item?.positive_checkout_fee_selection_strategy,
							'discount',
							'checkout'
						)}
					</div>
				</ScRadioGroup>
				<ScRadioGroup
					label={__('Line Item', 'surecart')}
					onScChange={(e) =>
						editItem({
							positive_line_item_fee_selection_strategy:
								e.target.value,
						})
					}
					help={__('Line Item selection strategy.', 'surecart')}
				>
					<ScFlex
						style={{
							'--sc-flex-column-gap': '1.5em',
							'--sc-flex-space-between': 'flex-start',
						}}
					>
						<ScRadio
							value="all"
							checked={
								'all' ===
								item?.positive_line_item_fee_selection_strategy
							}
						>
							{__('All', 'surecart')}
						</ScRadio>
						<ScRadio
							value="first"
							checked={
								'first' ===
								item?.positive_line_item_fee_selection_strategy
							}
						>
							{__('First', 'surecart')}
						</ScRadio>
						<ScRadio
							value="biggest"
							checked={
								'biggest' ===
								item?.positive_line_item_fee_selection_strategy
							}
						>
							{__('Biggest', 'surecart')}
						</ScRadio>
						<ScRadio
							value="lowest"
							checked={
								'lowest' ===
								item?.positive_line_item_fee_selection_strategy
							}
						>
							{__('Lowest', 'surecart')}
						</ScRadio>
					</ScFlex>
					<div
						style={{
							opacity: '0.85',
							marginTop: 'var(--sc-input-label-margin)',
							color: 'var(--sc-color-gray-500)',
							fontSize: 'var(--sc-font-size-medium)',
						}}
					>
						{getHelpText(
							item?.positive_line_item_fee_selection_strategy,
							'discount',
							'line_item'
						)}
					</div>
				</ScRadioGroup>
				<ScRadioGroup
					label={__('Shipping', 'surecart')}
					onScChange={(e) =>
						editItem({
							positive_shipping_fee_selection_strategy:
								e.target.value,
						})
					}
					help={__('Shipping selection strategy.', 'surecart')}
				>
					<ScFlex
						style={{
							'--sc-flex-column-gap': '1.5em',
							'--sc-flex-space-between': 'flex-start',
						}}
					>
						<ScRadio
							value="all"
							checked={
								'all' ===
								item?.positive_shipping_fee_selection_strategy
							}
						>
							{__('All', 'surecart')}
						</ScRadio>
						<ScRadio
							value="first"
							checked={
								'first' ===
								item?.positive_shipping_fee_selection_strategy
							}
						>
							{__('First', 'surecart')}
						</ScRadio>
						<ScRadio
							value="biggest"
							checked={
								'biggest' ===
								item?.positive_shipping_fee_selection_strategy
							}
						>
							{__('Biggest', 'surecart')}
						</ScRadio>
						<ScRadio
							value="lowest"
							checked={
								'lowest' ===
								item?.positive_shipping_fee_selection_strategy
							}
						>
							{__('Lowest', 'surecart')}
						</ScRadio>
					</ScFlex>
					<div
						style={{
							opacity: '0.85',
							marginTop: 'var(--sc-input-label-margin)',
							color: 'var(--sc-color-gray-500)',
							fontSize: 'var(--sc-font-size-medium)',
						}}
					>
						{getHelpText(
							item?.positive_shipping_fee_selection_strategy,
							'discount',
							'shipping'
						)}
					</div>
				</ScRadioGroup>
			</SettingsBox>
		</SettingsTemplate>
	);
};
