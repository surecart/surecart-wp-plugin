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
		parseInt(product?.initial_stock) !== parseInt(product?.stock)
			? parseInt(product?.stock) - parseInt(product?.initial_stock)
			: 0
	);

	const onSubmit = (e) => {
		e.preventDefault();
		if (isNaN(stockAdjustment) || stockAdjustment === '') {
			updateProduct({
				stock_adjustment: stockAdjustment,
				stock: product?.initial_stock,
			});
		} else {
			updateProduct({
				stock_adjustment: undefined,
				stock:
					parseInt(product?.initial_stock) +
					parseInt(stockAdjustment),
			});
		}
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
				`}
				overlayClassName={'sc-modal-overflow'}
				onRequestClose={onRequestClose}
				shouldCloseOnClickOutside={false}
			>
				<ScForm
					onScFormSubmit={onSubmit}
					css={css`
						--sc-form-row-spacing: var(--sc-spacing-large);
					`}
				>
					<ScFormControl
						label={__('Adjust the stock quantity', 'surecart')}
					>
						<ScQuantitySelect
							css={css`
								margin-top: 0.3rem;
							`}
							allowNegative={true}
							quantity={stockAdjustment}
							onScChange={(e) => setStockAdjustment(e.detail)}
						/>
					</ScFormControl>
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
					{loading && <sc-block-ui></sc-block-ui>}
				</ScForm>
			</Modal>
		</Fragment>
	);
};
