/**
 * External dependencies.
 */
import { useDispatch, select } from '@wordpress/data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScForm,
	ScInput,
} from '@surecart/components-react';
import Error from '../../components/Error';

export default ({ open, onRequestClose, order }) => {
	const [name, setName] = useState('');
	const [value, setValue] = useState('');
	const [busy, setBusy] = useState('');
	const [error, setError] = useState(null);
	const input = useRef(null);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { baseURL } = select(coreStore).getEntityConfig(
		'surecart',
		'checkout'
	);
	useEffect(() => {
		if (open) {
			input.current.triggerFocus();
		}
	}, [open]);

	const onSubmit = async (e) => {
		e.preventDefault();
		setBusy(true);
		setError(null);

		try {
			const checkout = await apiFetch({
				path: `${baseURL}/${order?.checkout?.id}`,
				method: 'PATCH',
				data: {
					metadata: {
						...order?.checkout?.metadata,
						[name]: value,
					},
				},
			});

			if (checkout && checkout.id) {
				receiveEntityRecords(
					'surecart',
					'order',
					{
						...order,
						checkout: {
							...order.checkout,
							metadata: checkout?.metadata,
						},
					},
					undefined,
					false,
					{
						checkout: {
							...order.checkout,
							metadata: checkout?.metadata,
						},
					}
				);

				createSuccessNotice(__('Order Data added.', 'surecart'), {
					type: 'snackbar',
				});

				onRequestClose();
			}
		} catch (err) {
			setError(err);
		} finally {
			setBusy(false);
		}
	};

	return (
		<ScForm onScFormSubmit={onSubmit}>
			<ScDialog
				label={__('New Order Data', 'surecart')}
				open={open}
				onScRequestClose={onRequestClose}
			>
				<Error error={error} />

				<ScInput
					ref={input}
					label={__('Name', 'surecart')}
					onScInput={(e) => setName(e.target.value)}
					value={name}
					name="name"
					required
					autofocus={open}
				/>
				<ScInput
					label={__('Value', 'surecart')}
					onScInput={(e) => setValue(e.target.value)}
					value={value}
					name="value"
					required
					style={{ marginTop: '1rem' }}
				/>
				<ScButton type="primary" submit slot="footer">
					{__('Add', 'surecart')}
				</ScButton>
				<ScButton onClick={onRequestClose} type="text" slot="footer">
					{__('Cancel', 'surecart')}
				</ScButton>
				{busy && <ScBlockUi spinner />}
			</ScDialog>
		</ScForm>
	);
};
