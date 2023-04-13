/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
	ScForm,
	ScInput,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import Error from '../../../components/Error';

export default ({ open, onRequestClose, productId }) => {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const { saveEntityRecord } = useDispatch(coreStore);
	const [imageUrl, setImageUrl] = useState('');

	const onAddImage = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			await saveEntityRecord(
				'surecart',
				'product-medias',
				{
					product_id: productId,
					url: imageUrl,
				},
				{ throwOnError: true }
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
			label={__('Add Product Image', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
			<ScForm onScFormSubmit={onAddImage}>
				<div>
					<ScInput
						required
						name="imageUrl"
						label={__('Image URL', 'surecart')}
						value={imageUrl}
						type="text"
						placeholder={__('https://', 'surecart')}
						onScInput={(e) => setImageUrl(e.target.value)}
					/>
				</div>
				<ScFlex justifyContent="space-between">
					<ScButton
						type="text"
						onClick={onRequestClose}
						disabled={loading}
					>
						{__('Cancel', 'surecart')}
					</ScButton>{' '}
					<ScButton type="primary" disabled={loading} submit>
						{__('Add Image', 'surecart')}
					</ScButton>
				</ScFlex>
			</ScForm>
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
