/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScAddress,
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
	ScForm,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Error from '../../../components/Error';
import { useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';

export default ({ customerId, open, onRequestClose }) => {
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const onEditAddress = async () => {
		try {
			setBusy(true);
			const customer = await apiFetch({
				path: addQueryArgs(`/surecart/v1/customers/${customerId}`, {
					expand: ['shipping_address', 'balances'],
				}),
				method: 'PATCH',
				data: {
					shipping_address: {},
				},
			});
			receiveEntityRecords('surecart', 'customer', customer);
			createSuccessNotice(__('Address Deleted', 'surecart'), {
				type: 'snackbar',
			});
			onRequestClose();
		} catch (e) {
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<ScDialog
			label={__('Delete Shipping Address', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
			style={{
				'--dialog-body-overflow': 'visible',
			}}
		>
			<Error error={error} setError={setError} />
			<ScForm
				onScSubmit={onEditAddress}
				onScFormSubmit={(e) => {
					e.stopImmediatePropagation();
				}}
			>
				{__(
					'Are you sure you want to delete address? This action cannot be undone.',
					'surecart'
				)}
				<ScFlex
					justifyContent="flex-end"
					css={css`
						margin-top: var(--sc-spacing-medium);
					`}
				>
					<ScButton
						type="text"
						onClick={onRequestClose}
						disabled={busy}
					>
						{__('Cancel', 'surecart')}
					</ScButton>{' '}
					<ScButton type="primary" disabled={busy} submit>
						{__('Delete', 'surecart')}
					</ScButton>
				</ScFlex>
			</ScForm>
			{busy && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</ScDialog>
	);
};
