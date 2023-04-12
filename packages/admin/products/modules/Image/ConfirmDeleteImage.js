/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScText,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import Error from '../../../components/Error';
import { useState } from 'react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default ({ open, onRequestClose, selectedImage }) => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const { deleteEntityRecord } = useDispatch(coreStore);

	const onConfirmDelete = async () => {
		try {
			setLoading(true);
			await deleteEntityRecord(
				'surecart',
				'product-medias',
				selectedImage?.id
			);
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScDialog
			label={__('Confirm', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
			<ScText>
				{__('Are you sure you want to delete product image?')}
			</ScText>
			<ScButton
				type="text"
				onClick={onRequestClose}
				disabled={loading}
				slot="footer"
			>
				{__("Don't delete", 'surecart')}
			</ScButton>{' '}
			<ScButton
				type="primary"
				onClick={onConfirmDelete}
				disabled={loading}
				slot="footer"
			>
				{__('Delete image', 'surecart')}
			</ScButton>
			{loading && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.75' }}
					zIndex="9"
					spinner
				/>
			)}
		</ScDialog>
	);
};
