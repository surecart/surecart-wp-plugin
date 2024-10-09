/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { select } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import Error from '../../components/Error';
import { ScBlockUi } from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';
import expand from '../checkout-query';

export default ({ open, onRequestClose, onConfirm }) => {
	const { invoice, checkout, receiveInvoice } = useInvoice();
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);

	const fillCustomerAddress = async () => {
		try {
			setBusy(true);
			setError(null);

			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'draft-checkout'
			);

			const data = await apiFetch({
				method: 'PATCH',
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
					expand,
					context: 'edit',
				}),
				data: {
					shipping_address: checkout?.customer?.shipping_address,
					billing_address: checkout?.customer?.billing_address,
					billing_matches_shipping:
						checkout?.customer?.billing_matches_shipping,
				},
			});

			receiveInvoice({
				...invoice,
				checkout: data,
			});

			onConfirm();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<ConfirmDialog
			isOpen={open}
			onConfirm={fillCustomerAddress}
			onCancel={onRequestClose}
			confirmButtonText={__('Confirm', 'surecart')}
		>
			<Error
				error={error}
				setError={setError}
				css={css`
					margin-bottom: var(--sc-spacing-medium);
				`}
			/>

			{__(
				"This will set the shipping and billing addresses to the customer's default addresses.",
				'surecart'
			)}

			{busy && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					spinner
				/>
			)}
		</ConfirmDialog>
	);
};
