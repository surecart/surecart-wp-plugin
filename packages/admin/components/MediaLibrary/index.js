/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Fragment, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

import {
	DropZoneProvider,
	DropZone,
	Button,
	FormFileUpload,
} from '@wordpress/components';

import Template from './template';
import { ScEmpty, ScSpinner } from '@surecart/components-react';
import useFileUpload from '../../mixins/useFileUpload';
import Error from '../Error';

export default ({
	render,
	isPrivate = true,
	addToGallery = false,
	allowedTypes,
	multiple = false,
	onClose,
	onSelect,
}) => {
	const [open, setOpen] = useState(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const uploadFile = useFileUpload();

	const { medias, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'media',
				{ context: 'edit', per_page: 10, page },
			];
			const medias = select(coreStore).getEntityRecords(...queryArgs);
			return {
				medias,
				fetching: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[page]
	);

	const renderMedias = () => {
		if (fetching) {
			return <ScSpinner></ScSpinner>;
		}
		if (!medias?.length) {
			return (
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: center;
					`}
				>
					<ScEmpty icon="image">
						{__('No items found', 'surecart')}
					</ScEmpty>
				</div>
			);
		}
		return (medias || []).map((media) => {
			return <div>{media.filename}</div>;
		});
	};

	const onRequestClose = () => {
		setOpen(false);
		onClose && onClose();
	};

	const addUpload = async (e) => {
		setError(false);
		const file = e.target.files[0];
		try {
			await uploadFile(file);
		} catch (e) {
			console.error(e);
			setError(
				e?.message ||
					__('Something went wrong. Please try again.', 'surecart')
			);
		}
	};

	const header = () => {
		return (
			<div
				css={css`
					display: flex;
					justify-content: flex-start;
					align-items: center;
					gap: 1em;
				`}
			>
				<FormFileUpload
					multiple={multiple}
					isPrimary
					onChange={(e) => {
						if (!e.target.files) {
							return;
						}
						addUpload(e);
					}}
				>
					{__('Upload Media', 'presto-player')}
				</FormFileUpload>{' '}
				{__('or drag and drop a file to upload.')}
			</div>
		);
	};

	/**
	 * Main Content
	 *
	 * @returns JSX
	 */
	const mainContent = () => {
		return (
			<DropZoneProvider
				css={css`
					overflow: auto;
					display: flex;
					flex-direction: column;
				`}
			>
				<div
					css={css`
						padding: 12px 24px;
						overflow: auto;
						display: flex;
						flex-direction: column;
					`}
				>
					<Error error={error} setError={setError} margin="80px" />

					{renderMedias()}

					<DropZone label={'Drop files'} onFilesDrop={addUpload} />
				</div>
			</DropZoneProvider>
		);
	};

	return (
		<Fragment>
			{render({ setOpen })}

			{open && (
				<Template
					title={__('SureCart Media', 'surecart')}
					header={header()}
					mainContent={mainContent()}
					onClose={() => setOpen(false)}
					footer={
						<Button isPrimary onClick={() => setOpen(false)}>
							{__('Choose', 'presto-player')}
						</Button>
					}
					sidebar={<>sidebar</>}
				/>
				// <Modal
				// 	title={__('Media Library', 'surecart')}
				// 	onRequestClose={onRequestClose}
				// 	isFullScreen
				// 	shouldCloseOnClickOutside={false}
				// >
				// 	<div
				// 		css={css`
				// 			display: flex;
				// 			flex-direction: column;
				// 		`}
				// 	>
				// 		<div></div>
				// 		<div
				// 			css={css`
				// 				margin-top: auto;
				// 			`}
				// 		>
				// 			<Button isPrimary>
				// 				{__('Choose', 'surecart')}
				// 			</Button>
				// 		</div>
				// 	</div>
				// </Modal>
			)}
		</Fragment>
	);
};
