/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScButton,
	ScForm,
	ScIcon,
	ScSelect,
	ScDrawer,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import Multiple from '../../../components/price/Multiple';
import OneTime from '../../../components/price/OneTime';
import PriceName from '../../../components/price/parts/PriceName';
import Subscription from '../../../components/price/Subscription';

export default ({ isOpen, onRequestClose, product }) => {
	const [error, setError] = useState(null);
	const [additionalErrors, setAdditionalErrors] = useState([]);
	const [loading, setLoading] = useState(false);
	const [price, setPrice] = useState({});
	const [type, setType] = useState('once');
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

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
		setPrice(null);
		onRequestClose();
	};

	const onSubmit = async (e) => {
		e.stopPropagation();
		try {
			setLoading(true);
			await saveEntityRecord(
				'surecart',
				'price',
				{
					...price,
					product: product?.id,
				},
				{ throwOnError: true }
			);
			createSuccessNotice(__('Price added.', 'surecart'), {
				type: 'snackbar',
			});
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
		<ScForm onScFormSubmit={onSubmit}>
			<ScDrawer
				label={__('Add A Price', 'surecart')}
				style={{ '--sc-drawer-size': '600px' }}
				onScRequestClose={onClose}
				open={isOpen}
				stickyHeader
			>
				<div
					css={css`
						display: flex;
						flex-direction: column;
						height: 100%;
					`}
				>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-medium);
							padding: var(--sc-spacing-x-large);
						`}
					>
						{error?.length && (
							<sc-alert type="danger" open={error?.length}>
								<span slot="title">{error}</span>
								{additionalErrors.map((e) => (
									<div>{e?.message}</div>
								))}
							</sc-alert>
						)}
						<PriceName price={price} updatePrice={updatePrice} />

						<ScSelect
							label={__('Payment type', 'surecart')}
							required
							unselect={false}
							value={type}
							onScChange={(e) => setType(e.target.value)}
							choices={[
								{
									value: 'once',
									label: __('One Time', 'surecart'),
								},
								{
									value: 'multiple',
									label: __('Installment', 'surecart'),
								},
								{
									value: 'subscription',
									label: __('Subscription', 'surecart'),
								},
							]}
						/>

						{type === 'subscription' && (
							<Subscription
								price={price}
								updatePrice={updatePrice}
							/>
						)}

						{type === 'multiple' && (
							<Multiple price={price} updatePrice={updatePrice} />
						)}

						{type === 'once' && (
							<OneTime price={price} updatePrice={updatePrice} />
						)}
					</div>
				</div>
				<div
					css={css`
						display: flex;
						justify-content: space-between;
					`}
					slot="footer"
				>
					<div>
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
					<div
						css={css`
							align-content: center;
						`}
					>
						{product?.tax_enabled &&
							scData?.tax_protocol?.tax_enabled &&
							scData?.tax_protocol?.tax_behavior ===
								'inclusive' && (
								<ScButton
									size="small"
									type="text"
									target="_blank"
									href="admin.php?page=sc-settings&tab=tax_protocol"
								>
									{__('Tax is included', 'surecart')}
									<ScIcon
										name="external-link"
										slot="suffix"
									/>
								</ScButton>
							)}
					</div>
				</div>

				{loading && <sc-block-ui spinner></sc-block-ui>}
			</ScDrawer>
		</ScForm>
	);
};
