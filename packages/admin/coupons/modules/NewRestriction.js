/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';
import {
	ScButton,
	ScForm,
	ScFormControl,
	ScSelect,
} from '@surecart/components-react';
import { Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import PriceSelector from '../../components/PriceSelector';
import ModelSelector from '../../components/ModelSelector';

export default ({ onRequestClose, coupon, updateCoupon }) => {
	const [type, setType] = useState('price_ids');
	const [id, setId] = useState();

	const onClose = () => {
		if (id) {
			const r = confirm(
				__(
					'Are you sure you want to discard this condition?',
					'surecart'
				)
			);
			if (!r) return;
		}
		onRequestClose();
	};

	const onSubmit = (e) => {
		updateCoupon({
			[`filter_${type}`]: [...(coupon?.[`filter_${type}`] || []), id],
		});
		onRequestClose();
	};

	return (
		<Modal
			title={__('Add A Restriction', 'surecart')}
			css={css`
				width: 100%;
				box-sizing: border-box;
			`}
			overlayClassName={'sc-modal-overflow'}
			onRequestClose={onClose}
			shouldCloseOnClickOutside={false}
		>
			<Global
				styles={css`
					.sc-modal-overflow {
						box-sizing: border-box;
						.components-modal__content,
						.components-modal__frame {
							/* overflow: visible !important; */
							box-sizing: border-box;
							max-width: 600px !important;
							width: 100%;
							overflow: visible !important;
						}
					}
				`}
			/>

			<ScForm
				onScFormSubmit={onSubmit}
				css={css`
					--sc-form-row-spacing: var(--sc-spacing-large);
				`}
			>
				<ScSelect
					label={__('Coupon is valid for', 'surecart')}
					value={type}
					unselect={false}
					choices={[
						{
							label: __('Price', 'surecart'),
							value: 'price_ids',
						},
						{
							label: __('Product', 'surecart'),
							value: 'product_ids',
						},
						{
							label: __('Customer', 'surecart'),
							value: 'customer_ids',
						},
					]}
					onScChange={(e) => setType(e.target.value)}
				/>

				{type === 'price_ids' && (
					<div>
						<ScFormControl label={__('Select A Price', 'surecart')}>
							<PriceSelector
								value={id}
								requestQuery={{
									archived: false,
									ad_hoc: false,
								}}
								onSelect={(price) => {
									setType('price_ids');
									setId(price);
								}}
							/>
						</ScFormControl>
					</div>
				)}

				{type === 'product_ids' && (
					<div>
						<ScFormControl
							label={__('Select A Product', 'surecart')}
						>
							<ModelSelector
								name="product"
								value={id}
								requestQuery={{
									archived: false,
								}}
								onSelect={(product) => {
									setType('product_ids');
									setId(product);
								}}
							/>
						</ScFormControl>
					</div>
				)}

				{type === 'customer_ids' && (
					<div>
						<ScFormControl
							label={__('Select A Customer', 'surecart')}
						>
							<ModelSelector
								name="customer"
								value={id}
								requestQuery={{
									archived: false,
								}}
								onSelect={(product) => {
									setType('customer_ids');
									setId(product);
								}}
							/>
						</ScFormControl>
					</div>
				)}

				{type === 'product_group_ids' && (
					<div>
						<ScFormControl
							label={__('Select An Upgrade Group', 'surecart')}
						>
							<ModelSelector
								name="product-group"
								value={id}
								requestQuery={{
									archived: false,
								}}
								onSelect={(product) => {
									setType('product_group_ids');
									setId(product);
								}}
							/>
						</ScFormControl>
					</div>
				)}

				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: 0.5em;
					`}
				>
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						<ScButton type="primary" submit>
							{__('Add Filter', 'surecart')}
						</ScButton>
						<ScButton type="text" onClick={onClose}>
							{__('Cancel', 'surecart')}
						</ScButton>
					</div>
				</div>
			</ScForm>
		</Modal>
	);
};
