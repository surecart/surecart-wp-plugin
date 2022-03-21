/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { Modal, Button } from '@wordpress/components';
import { ScForm } from '@surecart/components-react';
import { css, jsx } from '@emotion/core';
import { useState, Fragment } from '@wordpress/element';
import { useEffect } from 'react';
import { store } from '../../store/data';
import { translateInterval } from '../../util/translations';
import { select, useSelect } from '@wordpress/data';

export default ({
	pending,
	current,
	onCancel,
	loading,
	error,
	children,
	open,
}) => {
	const [modal, setModal] = useState(false);

	const { pendingProduct, pendingPrice, currentProduct, currentPrice } =
		useSelect(
			(select) => {
				return {
					pendingPrice: select(store).selectModel(
						'price',
						pending?.price
					),
					pendingProduct: select(store).selectRelation(
						'price',
						pending?.price,
						'product'
					),
					currentPrice: select(store).selectModel(
						'price',
						current?.price
					),
					currentProduct: select(store).selectRelation(
						'price',
						current?.price,
						'product'
					),
				};
			},
			[pending?.price, current?.price]
		);

	const onSubmit = async () => {
		onCancel();
	};

	useEffect(() => {
		setModal(open);
	}, [open]);

	const renderTitle = () => {
		if (pending.price !== current.price) {
			if (pending.quantity > current.quantity) {
				return __('Change Product And Increase Quantity', 'surecart');
			}
			if (pending.quantity < current.quantity) {
				return __('Change Product Decrease Quantity', 'surecart');
			}
			return __('Change Product', 'surecart');
		}

		if (pending.quantity > current.quantity) {
			return __('Increase quantity', 'surecart');
		}
		if (pending.quantity < current.quantity) {
			return __('Decrease quantity', 'surecart');
		}
		return null;
	};

	const renderPriceChange = () => {
		return (
			<div
				css={css`
					display: grid;
					gap: 0.5em;
				`}
			>
				<div
					css={css`
						text-decoration: line-through;
						padding: var(--sc-spacing-small);
						background-color: var(--sc-color-gray-100);
						border-radius: var(--sc-border-radius-small);
					`}
				>
					{currentProduct?.name} x {current?.quantity}
					<div style={{ opacity: 0.5 }}>
						<sc-format-number
							type="currency"
							value={
								currentPrice?.amount * (current?.quantity || 1)
							}
							currency={currentPrice?.currency}
						/>
						{translateInterval(
							currentPrice?.recurring_interval_count,
							currentPrice?.recurring_interval,
							' /',
							''
						)}
					</div>
				</div>
				<div
					css={css`
						padding: var(--sc-spacing-small);
						background-color: var(--sc-color-success-100);
						border-radius: var(--sc-border-radius-small);
						color: var(--sc-color-success-900);
					`}
				>
					{pendingProduct?.name} x
					{pending?.quantity || current?.quantity}
					<div style={{ opacity: 0.5 }}>
						<sc-format-number
							type="currency"
							value={
								pendingPrice?.amount *
								(pending?.quantity || current?.quantity || 1)
							}
							currency={pendingPrice?.currency}
						/>
						{translateInterval(
							pendingPrice?.recurring_interval_count,
							pendingPrice?.recurring_interval,
							' /',
							''
						)}
					</div>
				</div>
			</div>
		);
	};

	return (
		<Fragment>
			{children ? (
				<span onClick={() => setModal(!modal)}>{children}</span>
			) : (
				<sc-button
					size="small"
					onClick={() => setModal(!modal)}
					loading={loading}
				>
					{__('Cancel', 'surecart')}
				</sc-button>
			)}
			{modal && (
				<Modal
					title={__('Manage Scheduled Update', 'surecart')}
					css={css`
						max-width: 800px !important;
					`}
					onRequestClose={() => setModal(false)}
					shouldCloseOnClickOutside={false}
				>
					<ScForm
						onScFormSubmit={onSubmit}
						css={css`
							--sc-form-row-spacing: var(--sc-spacing-large);
						`}
					>
						<sc-alert type="danger" open={error}>
							{error}
						</sc-alert>

						<sc-card>
							<sc-text
								style={{
									'--font-size': 'var(--sc-font-size-large)',
								}}
							>
								{renderTitle()}
							</sc-text>
							{renderPriceChange()}
						</sc-card>

						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 0.5em;
							`}
						>
							<Button isPrimary isBusy={loading} type="submit">
								{__('Delete Update', 'surecart')}
							</Button>
							<Button onClick={() => setModal(false)}>
								{__('Keep Update', 'surecart')}
							</Button>
						</div>
					</ScForm>
				</Modal>
			)}
		</Fragment>
	);
};
