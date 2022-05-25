/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Modal, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

import { ScButton, ScForm, ScSelect } from '@surecart/components-react';
import OneTime from './OneTime';
import Subscription from './Subscription';
import Multiple from './Multiple';

export default ({ onRequestClose, productId }) => {
	const [error, setError] = useState(null);
	const [additionalErrors, setAdditionalErrors] = useState([]);
	const [loading, setLoading] = useState(false);
	const [price, setPrice] = useState({});
	const [type, setType] = useState('once');
	const { saveEntityRecord } = useDispatch(coreStore);

	// update the price.
	const updatePrice = (data) => {
		setPrice({ ...price, ...data });
	};

	const onClose = () => {
		if (price?.amount) {
			const r = confirm(
				__('Are you sure you want to discard this price?', 'surecart')
			);
			if (!r) return;
		}
		onRequestClose();
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			await saveEntityRecord(
				'surecart',
				'price',
				{
					...price,
					product: productId,
				},
				{ throwOnError: true }
			);
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e?.message || __('Something went wrong.', 'surecart'));
			if (e?.additional_errors) {
				setAdditionalErrors(e.additional_errors);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		switch (type) {
			case 'subscription':
				updatePrice({
					recurring_interval: 'month',
					recurring_interval_count: 1,
					recurring_period_count: null,
					recurring_end_behavior: 'cancel',
				});
				break;
			case 'multiple':
				updatePrice({
					recurring_interval: 'month',
					recurring_interval_count: 1,
					recurring_period_count: 3,
					recurring_end_behavior: 'complete',
				});
				break;
			case 'once':
				updatePrice({
					recurring_interval: null,
					recurring_interval_count: null,
					recurring_period_count: null,
					recurring_end_behavior: null,
				});
				break;
		}
	}, [type]);

	return (
		<Modal
			title={__('Add A Price', 'surecart')}
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
							overflow: visible !important;
							box-sizing: border-box;
							max-width: 600px !important;
							width: 100%;
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
				<sc-alert type="danger" open={error?.length}>
					<span slot="title">{error}</span>
					{additionalErrors.map((e) => (
						<div>{e?.message}</div>
					))}
				</sc-alert>

				<ScSelect
					label={__('Payment Type', 'surecart')}
					required
					unselect={false}
					value={type}
					onScChange={(e) => setType(e.target.value)}
					choices={[
						{
							value: 'once',
							label: __('One-time Payment', 'surecart'),
						},
						{
							value: 'multiple',
							label: __('Multiple Payments', 'surecart'),
						},
						{
							value: 'subscription',
							label: __('Subscription', 'surecart'),
						},
					]}
				/>

				{type === 'subscription' && (
					<Subscription price={price} updatePrice={updatePrice} />
				)}

				{type === 'multiple' && (
					<Multiple price={price} updatePrice={updatePrice} />
				)}

				{type === 'once' && (
					<OneTime price={price} updatePrice={updatePrice} />
				)}

				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 0.5em;
					`}
				>
					<ScButton
						type="primary"
						isBusy={loading}
						disabled={loading}
						submit
					>
						{__('Create Price', 'surecart')}
					</ScButton>
					<ScButton type="text" onClick={onClose}>
						{__('Cancel', 'surecart')}
					</ScButton>
				</div>
			</ScForm>
		</Modal>
	);
};
