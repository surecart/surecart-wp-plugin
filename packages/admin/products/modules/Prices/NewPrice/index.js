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
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import Multiple from '../../../components/price/Multiple';
import OneTime from '../../../components/price/OneTime';
import PriceName from '../../../components/price/parts/PriceName';
import Subscription from '../../../components/price/Subscription';
import Error from '../../../../components/Error';
import CanUpgrade from '../../../components/price/parts/CanUpgrade';
import SwapPrice from '../../../components/price/parts/SwapPrice';
import DrawerSection from '../../../../ui/DrawerSection';

export default ({ isOpen, onRequestClose, product }) => {
	if (!isOpen) return null;

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [price, setPrice] = useState({
		portal_subscription_update_enabled: true,
	});
	const [currentSwap, setCurrentSwap] = useState(null);
	const [type, setType] = useState('once');
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const ref = useRef(null);

	// update the price.
	const updatePrice = (data) => {
		setPrice({ ...price, ...data });
	};

	const editSwap = (data) => {
		setCurrentSwap({ ...currentSwap, ...data });
	};

	const onSubmit = async (e) => {
		e.stopPropagation();
		try {
			setLoading(true);
			const newPrice = await saveEntityRecord(
				'surecart',
				'price',
				{
					...price,
					product: product?.id,
				},
				{ throwOnError: true }
			);

			if (currentSwap) {
				await saveEntityRecord(
					'surecart',
					'swap',
					{
						...currentSwap,
						price: newPrice.id,
					},
					{ throwOnError: true }
				);
			}
			createSuccessNotice(__('Price added.', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
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
				});
				break;
			case 'multiple':
				updatePrice({
					recurring_interval: 'month',
					recurring_interval_count: 1,
					recurring_period_count: 3,
					revoke_purchases_on_completed: false,
				});
				break;
			case 'once':
				updatePrice({
					recurring_interval: null,
					recurring_interval_count: null,
					recurring_period_count: null,
				});
				break;
		}
	}, [type]);

	return (
		<ScForm onScFormSubmit={onSubmit}>
			<ScDrawer
				label={__('Add A Price', 'surecart')}
				style={{ '--sc-drawer-size': '32rem' }}
				onScAfterHide={onRequestClose}
				open={isOpen}
				stickyHeader
				onScAfterShow={() => ref.current.triggerFocus()}
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
							padding: 30px;
							display: grid;
							gap: 2em;
						`}
					>
						<Error error={error} setError={setError} />
						<DrawerSection
							title={__('Basic', 'surecart')}
							style={{
								padding: '0 30px',
								borderTop: 'none',
							}}
						>
							<PriceName
								price={price}
								updatePrice={updatePrice}
								ref={ref}
							/>

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
									product={product}
								/>
							)}

							{type === 'multiple' && (
								<Multiple
									price={price}
									updatePrice={updatePrice}
									product={product}
								/>
							)}

							{type === 'once' && (
								<OneTime
									price={price}
									updatePrice={updatePrice}
									product={product}
								/>
							)}

							<CanUpgrade
								price={price}
								updatePrice={updatePrice}
							/>
						</DrawerSection>
						<DrawerSection
							title={__('Revenue Booster', 'surecart')}
							style={{
								padding: '2em 30px 0',
							}}
						>
							<SwapPrice
								price={price}
								updateSwap={editSwap}
								currentSwap={currentSwap}
							/>
						</DrawerSection>
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
						<ScButton
							type="text"
							onClick={(e) =>
								e.target.closest('sc-drawer').requestClose()
							}
						>
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
