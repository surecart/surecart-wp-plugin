/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useState } from '@wordpress/element';
import {
	ScButton,
	ScCard,
	ScFormControl,
	ScIcon,
	ScSelect,
	ScStackedList,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import ProcessorItem from './ProcessorItem';

export default (props) => {
	const { label, value, placeholder, onChange } = props;
	const [addNew, setAddNew] = useState(false);
	const [processors, setProcessors] = useState([]);

	useEffect(() => {
		setProcessors([
			...((scBlockData?.processors || []).some(
				(p) => p.processor_type === 'stripe'
			)
				? [
						{
							label: __('Stripe', 'surecart'),
							value: 'stripe',
							disabled: value.includes('stripe'),
						},
				  ]
				: []),
			...((scBlockData?.processors || []).some(
				(p) => p.processor_type === 'paypal'
			)
				? [
						{
							label: __('PayPal', 'surecart'),
							value: 'paypal',
							disabled: value.includes('paypal'),
						},
				  ]
				: []),
			...(scBlockData?.manualPaymentMethods || []).map(
				(payment_method) => {
					return {
						label: payment_method.name,
						value: payment_method.id,
						disabled: value.includes(payment_method.id),
					};
				}
			),
		]);
	}, [value]);

	return (
		<>
			{!!(value || [])?.length && (
				<ScCard noPadding>
					<ScStackedList>
						{(value || []).map((id) => {
							const label = (processors || []).find(
								(processor) => processor?.value === id
							)?.label;
							if (!label) return;

							return (
								<ProcessorItem
									key={id}
									onRemove={() =>
										onChange(
											(value || []).filter(
												(existing) => existing !== id
											)
										)
									}
								>
									{label}
								</ProcessorItem>
							);
						})}
					</ScStackedList>
				</ScCard>
			)}
			{!(value || [])?.length || addNew ? (
				<ScFormControl
					label={label}
					showLabel={false}
					css={css`
						display: grid;
						gap: var(--sc-spacing-medium);
					`}
				>
					<ScSelect
						choices={processors}
						placeholder={placeholder}
						onScChange={(e) => {
							if (e.target.value) {
								onChange([
									...new Set([
										...(value || []),
										...[e.target.value],
									]),
								]);
							}
						}}
						onScClose={() => setAddNew(false)}
						open={addNew}
					/>
				</ScFormControl>
			) : (
				<div>
					<ScButton type="link" onClick={() => setAddNew(true)}>
						<ScIcon name="plus" slot="prefix" />
						{__('Add Another Processor', 'surecart')}
					</ScButton>
				</div>
			)}
		</>
	);
};
