/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { store as noticesStore } from '@wordpress/notices';
import { css, jsx } from '@emotion/react';
import apiFetch from '@wordpress/api-fetch';

// template
import Template from '../../templates/SingleModel';

// modules
import Price from './modules/Price';
import PaymentMethod from './modules/PaymentMethod';
import Schedule from './modules/Trial';
import Sidebar from './Sidebar';

// components
import ErrorFlash from '../../components/ErrorFlash';
import { store as dataStore } from '@surecart/data';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScFlex,
	ScFormatDate,
	ScIcon,
	ScSkeleton,
	ScSwitch,
} from '@surecart/components-react';
import useDirty from '../../hooks/useDirty';
import { useDispatch, useSelect } from '@wordpress/data';
import UpdateModel from '../../templates/UpdateModel';
import Logo from '../../templates/Logo';
import useEntity from '../../hooks/useEntity';
import UpcomingPeriod from './modules/UpcomingPeriod';
import SaveButton from '../../templates/SaveButton';
import Trial from './modules/Trial';

export default () => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const { saveDirtyRecords } = useDirty();
	const [upcoming, setUpcoming] = useState();
	const [loadingUpcoming, setLoadingUpcoming] = useState(false);
	const [skipProration, setSkipProration] = useState(false);
	const [updateBehavior, setUpdateBehavior] = useState('pending');

	const {
		subscription,
		savingSubscription,
		hasLoadedSubscription,
		editSubscription,
	} = useEntity('subscription', id, {
		expand: ['current_period', 'current_period.checkout'],
	});

	useEffect(() => {
		if (subscription?.id) {
			fetchUpcomingPeriod();
		}
	}, [subscription, skipProration, updateBehavior]);

	const fetchUpcomingPeriod = async () => {
		setLoadingUpcoming(true);
		const {
			id,
			ad_hoc_amount,
			cancel_at_period_end,
			trial_end_at,
			quantity,
			discount,
			price,
		} = subscription;

		try {
			const response = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(
					`surecart/v1/subscriptions/${id}/upcoming_period`,
					{
						skip_proration: skipProration,
						update_behavior: updateBehavior,
						skip_product_group_validation: true,
						expand: [
							'period.checkout',
							'checkout.line_items',
							'line_item.price',
							'price.product',
							'period.subscription',
						],
					}
				),
				data: {
					...(ad_hoc_amount ? { ad_hoc_amount } : {}),
					...(cancel_at_period_end ? { cancel_at_period_end } : {}),
					...(trial_end_at ? { trial_end_at } : {}),
					...(discount ? { discount } : {}),
					quantity,
					purge_pending_update: true,
					price,
				},
			});
			setUpcoming(response);
		} catch (e) {
			console.error(e);
			handleError(e);
		} finally {
			setLoadingUpcoming(false);
		}
	};

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		try {
			await saveDirtyRecords();
			// save success.
			createSuccessNotice(__('Subscription updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			handleError(e);
		}
	};

	const handleError = (e) => {
		console.error(e);
		createErrorNotice(e?.message || __('Something went wrong', 'surecart'));
		e?.additional_errors.forEach((e) => {
			createErrorNotice(e?.message);
		});
	};

	return (
		<UpdateModel
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						gap: 1em;
					`}
				>
					<ScButton
						circle
						size="small"
						href={addQueryArgs('admin.php', {
							page: 'sc-subscriptions',
							action: 'show',
							id: id,
						})}
					>
						<ScIcon name="arrow-left"></ScIcon>
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-subscriptions">
							{__('Orders', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							<ScFlex style={{ gap: '1em' }}>
								{__('Edit Subscription', 'surecart')}
							</ScFlex>
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</div>
			}
			button={
				<ScFlex alignItems="center">
					<ScSwitch
						checked={updateBehavior === 'immediate'}
						onScChange={(e) =>
							setUpdateBehavior(
								e.target.checked ? 'immediate' : 'pending'
							)
						}
					>
						{__('Update Immediately', 'surecart')}
					</ScSwitch>
					<SaveButton
						loading={!hasLoadedSubscription}
						busy={savingSubscription}
					>
						{updateBehavior === 'immediate'
							? __('Update and Charge Now', 'surecart')
							: __('Schedule Update', 'surecart')}
					</SaveButton>
				</ScFlex>
			}
			sidebar={
				<>
					<UpcomingPeriod
						upcoming={upcoming}
						loading={loadingUpcoming}
						skipProration={skipProration}
						setSkipProration={setSkipProration}
						updateBehavior={updateBehavior}
					/>
				</>
			}
		>
			<>
				<Price
					subscription={subscription}
					updateSubscription={editSubscription}
					upcoming={upcoming}
					loading={loadingUpcoming}
					priceId={subscription?.price?.id || subscription?.price}
				/>
				<Trial
					subscription={subscription}
					updateSubscription={editSubscription}
					loading={!hasLoadedSubscription}
				/>
			</>
		</UpdateModel>
	);

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
							checked={skipProration}
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
