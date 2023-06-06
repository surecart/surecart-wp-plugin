import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
	ScForm,
	ScInput,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState, useRef, useEffect } from 'react';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import Error from '../../../components/Error';

export default ({ open, onRequestClose, productId }) => {
	const input = useRef();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const { saveEntityRecord } = useDispatch(coreStore);
	const [imageUrl, setImageUrl] = useState('');

	const onAddImage = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!imageUrl) return;

		try {
			setLoading(true);
			await saveEntityRecord(
				'surecart',
				'product-media',
				{
					product_id: productId,
					url: imageUrl,
				},
				{ throwOnError: true }
			);
			setImageUrl('');
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (open) {
			input.current.triggerFocus();
		}
	}, [open]);

	return (
		<ScDialog
			label={__('Add Product Image', 'surecart')}
			open={open}
			onScRequestClose={onRequestClose}
		>
			<Error error={error} setError={setError} />
			<ScForm
				onScFormSubmit={onAddImage}
				onScSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<div>
					<ScInput
						ref={input}
						type="url"
						label={__('Image URL', 'surecart')}
						placeholder={__('https://', 'surecart')}
						help={__(
							'We recommend that you optimize your images before linking them to your products.',
							'surecart'
						)}
						value={imageUrl}
						onScInput={(e) => setImageUrl(e.target.value)}
						required
					/>
				</div>
				<ScFlex justifyContent="flex-end">
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
