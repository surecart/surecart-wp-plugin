/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	CeCard,
	CeFormControl,
	CeStackedList,
} from '@checkout-engine/components-react';
import { FormFileUpload, DropZone, Spinner } from '@wordpress/components';
import SingleFile from './SingleFile';
import Box from '../../ui/Box';

export default ({ product, updateProduct, loading }) => {
	const doUpload = async (e) => {
		const files = e.currentTarget.files;
		updateProduct({
			files: {
				data: [...(product.files?.data || []), ...files],
			},
		});
	};

	const renderFiles = () => {
		if (loading) {
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

		if ((product?.files?.data || []).length) {
			return (
				<div>
					<CeCard noPadding>
						<CeStackedList>
							{product?.files?.data.map((file, index) => (
								<SingleFile
									file={file}
									key={index}
									product={product}
									onUploaded={(id) => {
										updateProduct({
											...product,
											file_upload_ids: [
												...(product?.file_upload_ids ||
													[]),
												id,
											],
										});
									}}
									onRemoved={(id) => {
										updateProduct({
											files: {
												data: (
													product.files.data || []
												).filter(
													(file) => file.id !== id
												),
											},
											file_upload_ids: (
												product?.file_upload_ids || []
											).filter(
												(upload_id) => upload_id !== id
											),
										});
									}}
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
					<FormFileUpload isPrimary onChange={doUpload}>
						{__('Upload File', 'checkout_engine')}
					</FormFileUpload>
					<DropZone onFilesDrop={doUpload} />
				</div>
			</CeFormControl>
		</Box>
	);
};
