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

export default ({ onRequestClose, bump, updateBump }) => {
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
		updateBump({
			filters: {
				...(bump?.filters || {}),
				[type]: [...(bump?.filters?.[type] || []), id],
			},
		});
		onRequestClose();
	};

	return (
		<Modal
			title={__('Add A Condition', 'surecart')}
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
					label={__('Choose An Item', 'surecart')}
					value={type}
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
							label: __('Upgrade Group', 'surecart'),
							value: 'product_group_ids',
						},
					]}
					onScChange={(e) => setType(e.target.value)}
				/>

				{type === 'price_ids' && (
					<div>
						<ScFormControl label={__('Select A Price', 'surecart')}>
							<PriceSelector
								value={id}
								style={{ width: '50%' }}
								ad_hoc={false}
								requestQuery={{
									archived: false,
								}}
								onSelect={(price) => setId(price)}
							/>
						</ScFormControl>
					</div>
				)}

				{type === 'product_ids' && 'product selector'}

				{type === 'product_group_ids' && 'product group'}

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
							{__('Add Condition', 'surecart')}
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
