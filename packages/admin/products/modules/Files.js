/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';

import {
	CeCard,
	CeFormControl,
	CeStackedList,
} from '@checkout-engine/components-react';
import { useState, useEffect } from '@wordpress/element';
import { FormFileUpload, DropZone, Spinner } from '@wordpress/components';
import SingleFile from './SingleFile';
import Box from '../../ui/Box';
import useFileUpload from '../../mixins/useFileUpload';

export default ({ product, updateProduct, loading }) => {
	const [busy, setBusy] = useState(false);
	const uploadFile = useFileUpload();

	const doUpload = async (e) => {
		const file = e.currentTarget.files[0];
		updateProduct({ files: [...product.files, file] });
		// if (!file) return;
		// try {
		// 	setBusy(true);
		// 	const id = await uploadFile(file);
		// 	updateProduct({
		// 		file_upload_ids: [...(product?.file_upload_ids || []), id],
		// 	});
		// } catch (e) {
		// 	console.error(e);
		// 	setBusy(false);
		// } finally {
		// 	setBusy(false);
		// }
	};

	const renderFiles = () => {
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

		if ((product?.files || []).length) {
			return (
				<div>
					<CeCard noPadding>
						<CeStackedList>
							{product.files.map((file) => (
								<SingleFile
									file={file}
									product={product}
									onUploaded={(id) =>
										updateProduct({
											file_upload_ids: [
												...(product?.file_upload_ids ||
													[]),
												id,
											],
										})
									}
									onRemoved={(id) =>
										updateProduct({
											files: product.files.filter(
												(file) => file.id !== id
											),
											file_upload_ids: (
												product?.file_upload_ids || []
											).filter(
												(upload_id) => upload_id !== id
											),
										})
									}
								/>
							))}
						</CeStackedList>
					</CeCard>
				</div>
			);
		}

		return null;
	};

	return (
		<Box title={__('Files', 'checkout_engine')} loading={loading}>
			{renderFiles()}
			<CeFormControl
				label={__('Files', 'checkout_engine')}
				showLabel={false}
			>
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
						'Drag and drop an file here or click to select a file.',
						'checkout_engine'
					)}
					<FormFileUpload
						isPrimary
						accept="image/*"
						onChange={doUpload}
					>
						{__('Upload File', 'checkout_engine')}
					</FormFileUpload>
					<DropZone onFilesDrop={doUpload} />
				</div>
			</CeFormControl>
		</Box>
	);
};
