/**
 * External dependencies.
 */
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useEffect, useRef, useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';

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
import Error from '../../../components/Error';

export default ({ open, onRequestClose, onCreate, suggestion = '' }) => {
	const [busy, setBusy] = useState(false);
	const [name, setName] = useState('');
	const [error, setError] = useState(null);
	const input = useRef(null);
	const { saveEntityRecord } = useDispatch(coreStore);
	const { createSuccessNotice } = useDispatch(noticesStore);

	useEffect(() => {
		if (open) {
			input.current.triggerFocus();
		}
	}, [open]);

	const onSubmit = async (e) => {
		e.stopImmediatePropagation();
		try {
			setBusy(true);
			const collection = await saveEntityRecord(
				'surecart',
				'product-collection',
				{
					name: name || suggestion,
				},
				{
					throwOnError: true,
				}
			);
			createSuccessNotice(__('Collection created.', 'surecart'), {
				type: 'snackbar',
			});
			setName('');
			onCreate(collection);
			onRequestClose();
		} catch (e) {
			setError(e);
			console.error(e);
		} finally {
			setBusy(false);
		}
	};

	return (
		<ScForm onScFormSubmit={onSubmit}>
			<ScDialog
				label={__('New Collection', 'surecart')}
				open={open}
				onScRequestClose={onRequestClose}
			>
				<Error error={error} />

				<ScInput
					ref={input}
					label={__('Collection Name', 'surecart')}
					className="sc-product-name hydrated"
					help={__('A name for your product collection.', 'surecart')}
					onScInput={(e) => setName(e.target.value)}
					value={name || suggestion}
					name="name"
					required
					autofocus={open}
					style={{ marginTop: '1rem' }}
				/>
				<ScButton type="primary" submit slot="footer">
					{__('Create', 'surecart')}
				</ScButton>
				<ScButton onClick={onRequestClose} type="text" slot="footer">
					{__('Cancel', 'surecart')}
				</ScButton>
				{busy && <ScBlockUi spinner />}
			</ScDialog>
		</ScForm>
	);
};
