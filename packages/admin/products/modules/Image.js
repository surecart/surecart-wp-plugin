/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import { CeFormControl } from '@surecart/components-react';
import { useState, useEffect } from '@wordpress/element';
import {
	FormFileUpload,
	DropZone,
	Spinner,
	Button,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import Box from '../../ui/Box';

import { DirectUpload } from '@rails/activestorage';

export default ({ product, updateProduct, loading }) => {
	const [busy, setBusy] = useState(false);
	const [src, setSrc] = useState('');

	useEffect(() => {
		if (product?.image_url) {
			setSrc(product.image_url);
		}
	}, [product?.image_url]);

	const onRemove = async () => {
		const r = confirm(
			__('Are you sure you want to remove this image?', 'surecart')
		);
		if (!r) return;
		try {
			setBusy(true);
			// first get the unique upload id.
			if (product?.id) {
				await apiFetch({
					method: 'DELETE',
					path: `/surecart/v1/products/${product.id}/purge_image`,
				});
			}
			updateProduct({
				image_url: '',
				image_upload_id: null,
			});
			setSrc('');
		} catch (e) {
			console.log(e);
		} finally {
			setBusy(false);
		}
	};

	const uploadImage = async (e) => {
		const file = e.currentTarget.files[0];
		setSrc(URL.createObjectURL(file));
		if (!file) return;
		try {
			setBusy(true);

			// first get the unique upload id.
			const { id } = await apiFetch({
				method: 'POST',
				path: '/surecart/v1/uploads',
			});

			// then upload the file.
			const directUpload = new DirectUpload(
				file,
				`${ceData.app_url}uploads/${id}/presign`
			);

			directUpload.create(async (error, blob) => {
				if (error) {
					setBusy(false);
				} else {
					updateProduct({ image_upload_id: id });
					setBusy(false);
				}
			});
		} catch (e) {
			setBusy(false);
		}
	};

	const renderContent = () => {
		if (busy || loading) {
			return (
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: center;
					`}
				>
					<Spinner />
				</div>
			);
		}

		if (src) {
			return (
				<div
					css={css`
						display: grid;
						gap: 1em;
					`}
				>
					<img
						src={src}
						alt="product image"
						css={css`
							max-width: 100%;
							width: 380px;
							aspect-ratio: 1/1;
							object-fit: cover;
							height: auto;
							display: block;
							border-radius: var(--ce-border-radius-medium);
							background: #f3f3f3;
						`}
						onLoad={() => URL.revokeObjectURL(src)}
					/>
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						<FormFileUpload
							isSecondary
							accept="image/*"
							onChange={uploadImage}
						>
							{__('Replace', 'surecart')}
						</FormFileUpload>
						<Button isTertiary onClick={onRemove}>
							{__('Remove', 'surecart')}
						</Button>
					</div>
				</div>
			);
		}

		return (
			<div
				css={css`
					position: relative;
					border: 2px dashed var(--ce-color-gray-200);
					border-radius: var(--ce-border-radius-small);
					padding: 2em;
					display: grid;
					gap: 1em;
					text-align: center;
				`}
			>
				{__(
					'Drag and drop an image here or click to select a file.',
					'surecart'
				)}
				<FormFileUpload
					isPrimary
					accept="image/*"
					onChange={uploadImage}
				>
					{__('Upload File', 'surecart')}
				</FormFileUpload>
				<DropZone onFilesDrop={uploadImage} />
			</div>
		);
	};

	return (
		<Box title={__('Product Image', 'surecart')} loading={loading}>
			<CeFormControl
				label={__('Product Image', 'surecart')}
				showLabel={false}
			>
				{renderContent()}
			</CeFormControl>
		</Box>
	);
};
