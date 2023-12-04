/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { Modal } from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScForm,
	ScFormControl,
	ScQuantitySelect,
} from '@surecart/components-react';

export default ({ onRequestClose, product, updateProduct, loading }) => {
	const [stockAdjustment, setStockAdjustment] = useState(
		product?.stock_adjustment
	);

	const onSubmit = (e) => {
		e.preventDefault();
		updateProduct({ stock_adjustment: stockAdjustment });
		onRequestClose();
	};

	return (
		<Fragment>
			<Global
				styles={css`
					.sc-modal-overflow .components-modal__frame {
						overflow: visible !important;
					}
				`}
			/>
			<Modal
				title={__('Stock adjustment', 'surecart')}
				css={css`
					max-width: 500px !important;
					.components-modal__content {
						overflow: visible !important;
					}
					--sc-quantity-input-max-width: 100%;
					--sc-quantity-select-width: 100%;
					--sc-quantity-control-height: var(--sc-input-height-medium);
				`}
				overlayClassName={'sc-modal-overflow'}
				onRequestClose={onRequestClose}
			>
				<ScForm
					onScFormSubmit={onSubmit}
					css={css`
						--sc-form-row-spacing: var(--sc-spacing-large);
					`}
				>
					<div>
						<ScFormControl label={__('Adjust By', 'surecart')}>
							<ScQuantitySelect
								css={css`
									width: 100%;
								`}
								min={-9999999}
								allowNegative={true}
								quantity={stockAdjustment || 0}
								onScInput={(e) => setStockAdjustment(e.detail)}
							/>
						</ScFormControl>
					</div>
					<div>
						<ScFormControl label={__('Available', 'surecart')}>
							<ScQuantitySelect
								css={css`
									width: 100%;
								`}
								quantity={
									(product?.available_stock || 0) +
									(stockAdjustment || 0)
								}
								onScInput={(e) =>
									setStockAdjustment(
										e.detail -
											(product?.available_stock || 0)
									)
								}
								min={-9999999}
								name="stock"
							/>
						</ScFormControl>
					</div>
					<div>
						<ScFormControl label={__('On Hand', 'surecart')}>
							<ScQuantitySelect
								css={css`
									width: 100%;
								`}
								quantity={
									(product?.stock || 0) +
									(stockAdjustment || 0)
								}
								onScInput={(e) =>
									setStockAdjustment(
										e.detail - (product?.stock || 0)
									)
								}
								min={-9999999}
								name="stock"
							/>
						</ScFormControl>
					</div>
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
							margin-top: var(--sc-spacing-large);
						`}
					>
						<ScButton
							type="primary"
							style={{
								'--button-border-radius':
									'--sc-input-border-radius-small',
							}}
							busy={loading}
							disabled={loading}
							submit
						>
							{__('Adjust', 'surecart')}
						</ScButton>
						<ScButton type="text" onClick={onRequestClose}>
							{__('Cancel', 'surecart')}
						</ScButton>
					</div>
				</ScForm>
			</Modal>
		</Fragment>
	);
};
