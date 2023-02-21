/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScAlert,
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
	ScForm,
	ScText,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import Error from '../../../../components/Error';
import { useEffect } from 'react';
import { formatNumber } from '../../../../util';

export default ({ purchase, open, onRequestClose }) => {
	const { receiveEntityRecords, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [loadingUpcoming, setLoadingUpcoming] = useState(false);
	const [upcoming, setUpcoming] = useState();
	const id = purchase?.subscription?.id || purchase.subscription;

	useEffect(() => {
		if (id && open && purchase?.revoked) {
			fetchUpcomingPeriod();
		}
	}, [id, open]);

	const fetchUpcomingPeriod = async () => {
		setLoadingUpcoming(true);
		try {
			const response = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(
					`surecart/v1/subscriptions/${id}/upcoming_period`,
					{
						skip_product_group_validation: true,
						expand: ['period.checkout'],
					}
				),
				data: {
					purge_pending_update: false,
				},
			});
			setUpcoming(response);
		} catch (e) {
			console.error(e);
			createErrorNotice(e?.message, { type: 'snackbar' });
		} finally {
			setLoadingUpcoming(false);
		}
	};

	const onSubmit = async () => {
		try {
			setLoading(true);
			const result = await apiFetch({
				path: addQueryArgs(
					`surecart/v1/purchases/${purchase?.id}/${
						!purchase?.revoked ? 'revoke' : 'invoke'
					}`,
					{
						expand: ['product', 'product.price'],
					}
				),
				method: 'PATCH',
			});
			receiveEntityRecords(
				'surecart',
				'purchase',
				result,
				undefined,
				false,
				purchase
			);
			await invalidateResolutionForStore();
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	const renderAlert = () => {
		return (
			<ScAlert
				type="warning"
				title={__('Confirm Charge', 'surecart')}
				open
			>
				{!!upcoming?.checkout?.amount_due &&
				!!upcoming?.checkout?.currency
					? sprintf(
							__(
								'The subscription will be restored in order to restore the purchase. The customer will immediately be charged %s for the first billing period.',
								'surecart'
							),
							formatNumber(
								upcoming?.checkout?.amount_due,
								upcoming?.checkout?.currency
							)
					  )
					: __(
							'The subscription will be restored in order to restore the purchase. The customer will immediately be charged the first billing period.',
							'surecart'
					  )}
			</ScAlert>
		);
	};

	const renderConfirmText = () => {
		if (purchase?.subscription) {
			return purchase?.revoked
				? renderAlert()
				: __(
						'The subscription will be canceled in order to revoke the purchase.',
						'surecart'
				  );
		}

		return purchase?.revoked
			? __('This action will re-enable associated access.', 'surecart')
			: __(
					'This action will remove the associated access and trigger any cancelation automations you have set up.',
					'surecart'
			  );
	};

	const renderConfirmButton = () => {
		if (purchase?.subscription) {
			return purchase?.revoked
				? __('Unrevoke Purchase & Restore Subscription', 'surecart')
				: __('Revoke Purchase & Cancel Subscription', 'surecart');
		}

		return purchase?.revoked
			? __('Unrevoke Purchase', 'surecart')
			: __('Revoke Purchase', 'surecart');
	};

	return (
		<ScDialog
			label={
				purchase?.revoked
					? __('Unrevoke Purchase', 'surecart')
					: __('Revoke Purchase', 'surecart')
			}
			open={open}
			onScRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
			<ScFlex flexDirection="column">
				<ScText
					style={{
						'--font-size': 'var(--sc-font-size-medium)',
						'--color': 'var(--sc-input-label-color)',
						'--line-height': 'var(--sc-line-height-dense)',
					}}
				>
					{renderConfirmText()}
				</ScText>
			</ScFlex>
			<ScButton
				type="text"
				onClick={onRequestClose}
				disabled={loading}
				slot="footer"
			>
				{__('Cancel', 'surecart')}
			</ScButton>{' '}
			<ScButton
				type="primary"
				onClick={onSubmit}
				disabled={loading}
				slot="footer"
			>
				{renderConfirmButton()}
			</ScButton>
			{(loading || loadingUpcoming) && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</ScDialog>
	);
};
