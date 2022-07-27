/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { css, jsx } from '@emotion/react';

// template
import Template from '../../templates/SingleModel';

import useCurrentPage from '../../mixins/useCurrentPage';

// modules
import Price from './modules/Price';
import PaymentMethod from './modules/PaymentMethod';
import Schedule from './modules/Schedule';
import Sidebar from './Sidebar';

// components
import ErrorFlash from '../../components/ErrorFlash';
import { ScButton, ScFormatDate, ScSwitch } from '@surecart/components-react';

export default () => {
	const [skip_proration, setSkipProration] = useState(true);
	let update_behavior = 'immediate';

	const {
		id,
		subscription,
		saveSubscription,
		isSaving,
		updateSubscription,
		setSaving,
		subscriptionErrors,
		clearSubscriptionErrors,
		isLoading,
		fetchSubscription,
		getRelation,
	} = useCurrentPage('subscription');

	const customer = getRelation('customer');
	const price = getRelation('price');
	const product = getRelation('price.product');

	const onSubmit = (e) => {
		e.preventDefault();
		setTimeout(async () => {
			try {
				setSaving(true);
				await saveSubscription({
					query: {
						update_behavior,
						skip_product_group_validation: true,
						skip_proration,
					},
				});
				setSaving(true);
				window.location.href = addQueryArgs('admin.php', {
					page: 'sc-subscriptions',
					action: 'show',
					id: id,
				});
			} catch (error) {
				setSaving(false);
			}
		}, 50);
	};

	const onInvalid = () => {};

	useEffect(() => {
		if (id) {
			fetchSubscription({
				query: {
					context: 'edit',
					expand: [
						'customer',
						'price',
						'price.product',
						'purchase',
						'payment_method',
						'payment_method.card',
					],
				},
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
				page: 'sc-subscriptions',
				action: 'show',
				id: id,
			})}
			backText={__('Cancel Editing', 'surecart')}
			title={
				id
					? __('Update Subscription', 'surecart')
					: __('Create Subscription', 'surecart')
			}
			sidebar={
				<Sidebar subscription={subscription} loading={isLoading} />
			}
			button={
				isLoading ? (
					<sc-skeleton
						style={{
							width: '120px',
							height: '35px',
							display: 'inline-block',
						}}
					></sc-skeleton>
				) : (
					<div
						css={css`
							display: flex;
							gap: 1em;
							align-items: center;
						`}
					>
						<ScSwitch
							checked={skip_proration}
							onScChange={(e) =>
								setSkipProration(e.target.checked)
							}
						>
							{__('Skip Proration', 'surecart')}
						</ScSwitch>
						<ScButton
							className={'sc-schedule-model'}
							disabled={isSaving}
							loading={isSaving}
							submit
							onClick={(e) => {
								e.preventDefault();
								// setUpdateBehavior('pending');
								update_behavior = 'pending';
								console.log({ update_behavior });
							}}
						>
							{__('Schedule for', 'surecart')}
							{'\u00A0'}
							<ScFormatDate
								date={subscription?.current_period_end_at}
								month="short"
								day="numeric"
								year="numeric"
								type="timestamp"
							></ScFormatDate>
						</ScButton>
						<ScButton
							type="primary"
							className={'sc-save-model'}
							disabled={isSaving}
							loading={isSaving}
							submit
							onClick={(e) => {
								e.preventDefault();
								update_behavior = 'immediate';
							}}
						>
							{__('Update Now', 'surecart')}
						</ScButton>
					</div>
				)
			}
		>
			<Fragment>
				<ErrorFlash
					errors={subscriptionErrors}
					onHide={clearSubscriptionErrors}
				/>

				<Price
					subscription={subscription}
					updateSubscription={updateSubscription}
					customer={customer}
					price={price}
					product={product}
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

				{isSaving && (
					<sc-block-ui
						spinner
						style={{ zIndex: 9, margin: 0 }}
					></sc-block-ui>
				)}
			</Fragment>
		</Template>
	);
};
