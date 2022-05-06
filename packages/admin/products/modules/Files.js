/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScCard,
	ScFormControl,
	ScStackedList,
} from '@surecart/components-react';
import { FormFileUpload, DropZone } from '@wordpress/components';
import SingleFile from './SingleFile';
import Box from '../../ui/Box';
import { useEffect, useState } from 'react';
import { select } from '@wordpress/data';
import { store } from '../../store/data';

export default ({ id, product, updateProduct, loading }) => {
	// stores our draft uploads.
	const [uploads, setUploads] = useState([]);

	// clear draft uploads on save.
	useEffect(() => {
		setUploads([]);
	}, [product?.files?.data?.length]);

	// set uploads from file input.
	const doUpload = async (e) => {
		const files = [...(e?.currentTarget?.files || e)];
		setUploads([...uploads, ...files]);
	};

	return (
		<Box title={__('Downloads', 'surecart')} loading={loading}>
			{(() => {
				if (!(product?.files?.data || [])?.length && !uploads.length)
					return null;

				return (
					<ScCard noPadding>
						<ScStackedList>
							{(product?.files?.data || [])
								.sort((a, b) => a.created_at - b.created_at)
								.map((file) => (
									<SingleFile
										file={file}
										key={file.id}
										onRemoved={({ file }) => {
											const product = id
												? select(store).selectModel(
														'product',
														id
												  )
												: select(store).selectDraft(
														'product',
														0
												  );
											updateProduct({
												files: {
													...product?.files,
													data: product?.files?.data.filter(
														(f) => f.id !== file.id
													),
												},
											});
										}}
									/>
								))}

							{uploads.map((file, index) => (
								<SingleFile
									file={file}
									key={index}
									onUploaded={async (upload_id) => {
										console.log({ upload_id });
										const product = id
											? select(store).selectModel(
													'product',
													id
											  )
											: select(store).selectDraft(
													'product',
													0
											  );
										await updateProduct({
											file_upload_ids: [
												...(product?.file_upload_ids ||
													[]),
												upload_id,
											],
										});
									}}
									onRemoved={({ upload_id }) => {
										setUploads(
											uploads.filter(
												(_, i) => i !== index
											)
										);
										updateProduct({
											file_upload_ids: (
												product?.file_upload_ids || []
											).filter((id) => id !== upload_id),
										});
									}}
								/>
							))}
						</ScStackedList>
					</ScCard>
				);
			})()}

			<ScFormControl label={__('File', 'surecart')} showLabel={false}>
				<div
					css={css`
						position: relative;
						border: 2px dashed var(--sc-color-gray-200);
						border-radius: var(--sc-border-radius-small);
						padding: 2em;
						display: grid;
						gap: 1em;
						text-align: center;
					`}
				>
					{__('Drag and drop files here', 'surecart')}
					<sc-divider>{__('Or', 'surecart')}</sc-divider>
					<FormFileUpload isPrimary multiple onChange={doUpload}>
						{__('Upload Files', 'surecart')}
					</FormFileUpload>

					<DropZone onFilesDrop={doUpload} />
				</div>
			</ScFormControl>
		</Box>
	);
};
