/**
 * External dependencies.
 */
import apiFetch from '@wordpress/api-fetch';
import { select, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import { ScBlockUi } from '@surecart/components-react';
import expand from '../checkout-query';
import Error from '../../components/Error';
import { useInvoice } from '../hooks/useInvoice';

export default ({ open, onRequestClose }) => {
	const {
		invoice,
		checkout,
		loading: hasLoading,
		receiveInvoice,
	} = useInvoice();
	const [loading, setLoading] = useState(hasLoading);
	const [error, setError] = useState(false);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const markAsPaid = async () => {
		try {
			setLoading(true);
			setError(null);
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'checkout'
			);

			const checkoutUpdated = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}/manually_pay`, {
					expand,
				}),
			});

			receiveInvoice({
				...invoice,
				status: checkoutUpdated?.status,
				checkout: checkoutUpdated,
			});

			createSuccessNotice(__('Invoice marked as Paid.', 'surecart'), {
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

	return (
		<ConfirmDialog
			isOpen={open}
			onConfirm={markAsPaid}
			onCancel={onRequestClose}
			confirmButtonText={__('Mark Paid', 'surecart')}
		>
			<Error error={error} />

			{__(
				'Are you sure you wish to mark the invoice as paid?',
				'surecart'
			)}

			{loading && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</ConfirmDialog>
	);
};
