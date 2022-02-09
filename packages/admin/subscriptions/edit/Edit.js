/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import FlashError from '../../components/FlashError';
import { addQueryArgs } from '@wordpress/url';

// template
import Template from '../../templates/SingleModel';

import useSnackbar from '../../hooks/useSnackbar';
import useCurrentPage from '../../mixins/useCurrentPage';
import { useEffect } from 'react';
import Customer from './modules/Customer';
import Price from './modules/Price';
import PaymentMethod from './modules/PaymentMethod';
import Schedule from './modules/Schedule';
import Sidebar from './Sidebar';
import SaveButton from '../../products/components/SaveButton';
import { CeButton, CeSwitch } from '@checkout-engine/components-react';
import { css, jsx } from '@emotion/react';
import { store } from '../../store/data';

export default () => {
	const { snackbarNotices, removeSnackbarNotice } = useSnackbar();

	const {
		id,
		subscription,
		updateSubscription,
		isLoading,
		error,
		fetchSubscription,
		saveSubscription,
	} = useCurrentPage('subscription');

	const { receiveModel } = useDispatch(store);

	const onSubmit = async (e) => {
		e.preventDefault();
		saveSubscription();
	};

	const onInvalid = () => {};

	useEffect(() => {
		if (id) {
			fetchSubscription({
				context: 'edit',
				expand: [
					'customer',
					'latest_invoice',
					'price',
					'price.product',
					'purchase',
					'payment_method',
					'payment_method.card',
				],
			});
		}
	}, [id]);

	return (
		<Template
			pageModelName={'subscriptions'}
			onSubmit={onSubmit}
			onInvalid={onInvalid}
			backButtonType="icon"
			backUrl={addQueryArgs('admin.php', {
				page: 'ce-subscriptions',
				action: 'show',
				id: id,
			})}
			backText={__('Cancel Editing', 'checkout_engine')}
			title={
				id
					? __('Update Subscription', 'checkout_engine')
					: __('Create Subscription', 'checkout_engine')
			}
			notices={snackbarNotices}
			sidebar={<Sidebar />}
			removeNotice={removeSnackbarNotice}
			button={
				isLoading ? (
					<ce-skeleton
						style={{
							width: '120px',
							height: '35px',
							display: 'inline-block',
						}}
					></ce-skeleton>
				) : (
					<div
						css={css`
							display: flex;
							gap: 1em;
							align-items: center;
						`}
					>
						<SaveButton>
							{id
								? __('Update Subscription', 'checkout_engine')
								: __('Create Subscriptoin', 'checkout_engine')}
						</SaveButton>
					</div>
				)
			}
		>
			<Fragment>
				<FlashError path="subscriptions" scrollIntoView />
				<Customer subscription={subscription} />
				<Price
					subscription={subscription}
					updateSubscription={updateSubscription}
					loading={isLoading}
				/>
				<Schedule
					subscription={subscription}
					updateSubscription={updateSubscription}
					loading={isLoading}
				/>
				<PaymentMethod
					subscription={subscription}
					updateSubscription={updateSubscription}
					loading={isLoading}
				/>
			</Fragment>
		</Template>
	);
};
