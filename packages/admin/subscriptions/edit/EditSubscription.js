/** @jsx jsx */
import useEntity from '../../hooks/useEntity';
import Logo from '../../templates/Logo';
import SaveButton from '../../templates/SaveButton';
import UpdateModel from '../../templates/UpdateModel';
import PaymentMethod from './modules/PaymentMethod';
import Price from './modules/Price';
import Trial from './modules/Trial';
import UpcomingPeriod from './modules/UpcomingPeriod';
import { css, jsx } from '@emotion/react';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
	ScFlex,
	ScIcon,
	ScSwitch,
} from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import apiFetch from '@wordpress/api-fetch';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { addQueryArgs } from '@wordpress/url';

export default () => {
	const id = useSelect((select) => select(dataStore).selectPageId());
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const [upcoming, setUpcoming] = useState();
	const [loadingUpcoming, setLoadingUpcoming] = useState(false);
	const [skipProration, setSkipProration] = useState(false);
	const [savingSubscription, setSavingSubscription] = useState(false);
	const [updateBehavior, setUpdateBehavior] = useState('pending');
	const { editEntityRecord } = useDispatch(coreStore);

	const editSubscription = (data) =>
		editEntityRecord('surecart', 'subscription', id, data);
	const { subscription, hasLoadedSubscription, hasEdits, edits } = useSelect(
		(select) => {
			const entityData = [
				'surecart',
				'subscription',
				id,
				{
					expand: ['current_period', 'current_period.checkout'],
				},
			];

			return {
				subscription: select(coreStore).getEditedEntityRecord(
					...entityData
				),
				hasLoadedSubscription: select(
					coreStore
				)?.hasFinishedResolution?.('getEditedEntityRecord', [
					...entityData,
				]),
				hasEdits: select(coreStore).hasEditsForEntityRecord(
					...entityData
				),
				edits: select(coreStore).getEntityRecordEdits(...entityData),
			};
		},
		[id]
	);

	useEffect(() => {
		if (subscription?.id) {
			console.log('fetching');
			fetchUpcomingPeriod();
		}
	}, [
		subscription?.id,
		subscription?.quantity,
		subscription?.price,
		subscription?.trial_end_at,
		skipProration,
		updateBehavior,
	]);

	const fetchUpcomingPeriod = async () => {
		setLoadingUpcoming(true);
		try {
			const response = await makeRequest({ preview: true });
			setUpcoming(response);
		} catch (e) {
			console.error(e);
			handleError(e);
		} finally {
			setLoadingUpcoming(false);
		}
	};

	const onSubmit = async () => {
		try {
			setSavingSubscription(true);
			const subscription = await makeRequest({ preview: false });

			receiveEntityRecords(
				'surecart',
				'subscription',
				subscription,
				undefined,
				false,
				edits
			);

			createSuccessNotice(__('Subscription updated.', 'surecart'), {
				type: 'snackbar',
			});
			window.location.assign(
				addQueryArgs('admin.php', {
					page: 'sc-subscriptions',
					action: 'show',
					id: id,
				})
			);
		} catch (e) {
			console.error(e);
			handleError(e);
		} finally {
			setSavingSubscription(false);
		}
	};

	/**
	 * Make the request
	 */
	const makeRequest = ({ preview = true }) => {
		if (!subscription?.id) return;

		const {
			id,
			ad_hoc_amount,
			cancel_at_period_end,
			trial_end_at,
			quantity,
			discount,
			price,
			payment_method,
		} = subscription;

		return apiFetch({
			method: 'PATCH',
			path: addQueryArgs(
				`surecart/v1/subscriptions/${id}/${
					preview ? 'upcoming_period' : ''
				}`,
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
				...(discount ? { discount } : {}),
				...(payment_method ? { payment_method } : {}),
				trial_end_at,
				quantity,
				purge_pending_update: true,
				price,
			},
		});
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
			onSubmit={onSubmit}
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
							{__('Subscription', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb
							href={addQueryArgs('admin.php', {
								page: 'sc-subscriptions',
								action: 'show',
								id: id,
							})}
						>
							{__('Subscription Details', 'surecart')}
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
					{!Object.keys(subscription?.pending_update || {}).length && (
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
					)}
					<SaveButton
						loading={!hasLoadedSubscription}
						busy={savingSubscription}
						disabled={!hasEdits}
					>
						{updateBehavior === 'immediate'
							? __('Update Subscription', 'surecart')
							: __('Schedule Update', 'surecart')}
					</SaveButton>
				</ScFlex>
			}
			sidebar={
				<>
					<UpcomingPeriod
						upcoming={upcoming}
						loading={!hasLoadedSubscription || loadingUpcoming}
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
				{subscription?.payment_method && (
					<PaymentMethod
						subscription={subscription}
						updateSubscription={editSubscription}
						loading={!hasLoadedSubscription}
					/>
				)}
			</>
		</UpdateModel>
	);
};
