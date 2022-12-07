/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Fragment, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect, useDispatch } from '@wordpress/data';
import { DropZone, Button, FormFileUpload } from '@wordpress/components';
import Template from './template';
import {
	ScBlockUi,
	ScButton,
	ScCard,
	ScEmpty,
	ScFormatBytes,
	ScTable,
	ScTableCell,
	ScTag,
} from '@surecart/components-react';
import useFileUpload from '../../mixins/useFileUpload';
import Error from '../Error';
import MediaItem from './MediaItem';
import Preview from './Preview';
import StorageLimitWarning from '../StorageLimitWarning';

export default ({
	render,
	isPrivate = true,
	multiple = false,
	onClose,
	onSelect,
}) => {
	const [perPage, setPerPage] = useState(50);
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const uploadFile = useFileUpload();
	const { saveEntityRecord } = useDispatch(coreStore);

	const { medias, fetching } = useSelect(
		(select) => {
			if (!open) return {}; // must be open.
			const queryArgs = [
				'surecart',
				'media',
				{
					context: 'edit',
					per_page: perPage,
					page,
					public_access: !isPrivate,
				},
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
		[page, open]
	);

	const renderMedias = () => {
		if (!medias?.length) {
			if (fetching) {
				return null;
			}
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
		return (
			<ScCard noPadding>
				<ScTable>
					<ScTableCell slot="head">File</ScTableCell>
					<ScTableCell slot="head">Visibility</ScTableCell>
					<ScTableCell
						slot="head"
						style={{ width: '100px', textAlign: 'right' }}
					>
						Added
					</ScTableCell>
					{(medias || []).map((media) => {
						return (
							<MediaItem
								media={media}
								key={media.id}
								selected={selected?.id === media?.id}
								onClick={(e) => {
									e.preventDefault();
									if (
										selected?.id &&
										media?.id === selected?.id
									) {
										setSelected(null);
									} else {
										setSelected(media);
									}
								}}
							/>
						);
					})}
				</ScTable>
			</ScCard>
		);
	};

	const onRequestClose = () => {
		setOpen(false);
		onClose && onClose();
	};

	const addUploads = async (files) => {
		setError(false);
		setUploading(true);
		try {
			await Promise.all(
				Array.from(files || []).map((file) => uploadMedia(file))
			);
		} catch (e) {
			console.error(e);
			setError(
				e?.message ||
					__('Something went wrong. Please try again.', 'surecart')
			);
		} finally {
			setUploading(false);
		}
	};

	const uploadMedia = async (file) => {
		const upload = await uploadFile(file, isPrivate);
		return await saveEntityRecord(
			'surecart',
			'media',
			{
				direct_upload_signed_id: upload?.signed_id,
			},
			{ throwOnError: true }
		);
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
						addUploads(e.target.files);
					}}
				>
					{__('Upload Media', 'surecart')}
				</FormFileUpload>{' '}
				{__('or drag and drop a file to upload.')}
			</div>
		);
	};

	const hasPrevious = page > 1;
	const hasNext = medias?.length === perPage;

	const mediaUsage = window?.scData?.entitlements?.medias_total_byte_size;
	const mediaUsagePercentage = mediaUsage
		? (mediaUsage?.count / mediaUsage?.limit) * 100
		: null;
	// if media usage is more than 75% :: show low media component
	const isLowMediaStorage = mediaUsagePercentage
		? Math.round(mediaUsagePercentage) >= 75
		: false;

	/**
	 * Main Content
	 *
	 * @returns JSX
	 */
	const mainContent = () => {
		return (
			<div
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
						gap: 3em;
					`}
				>
					<Error error={error} setError={setError} margin="80px" />

					{renderMedias()}

					{(hasPrevious || hasNext) && (
						<div
							css={css`
								display: flex;
								align-items: center;
								justify-content: space-between;
								margin-top: auto;
							`}
						>
							<Button
								isSecondary
								disabled={!hasPrevious}
								onClick={() => setPage(page - 1)}
							>
								{__('Previous Page', 'surecart')}
							</Button>

							<Button
								disabled={!hasNext}
								isSecondary
								onClick={() => setPage(page + 1)}
							>
								{__('Next Page', 'surecart')}
							</Button>
						</div>
					)}

					<DropZone label={'Drop files'} onFilesDrop={addUploads} />
				</div>
				{(uploading || fetching) && (
					<ScBlockUi
						spinner
						style={{ '--sc-block-ui-opacity': '0.5' }}
					></ScBlockUi>
				)}
			</div>
		);
	};

	return (
		<Fragment>
			{render({ setOpen })}

			{open && (
				<Template
					title={
						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 0.5em;
							`}
						>
							<span>{__('SureCart Media', 'surecart')}</span>
							{isPrivate ? (
								<ScTag
									type="warning"
									style={{ fontSize: '13px' }}
								>
									{__('Private', 'surecart')}
								</ScTag>
							) : (
								<ScTag
									type="success"
									style={{ fontSize: '13px' }}
								>
									{__('Public', 'surecart')}
								</ScTag>
							)}
						</div>
					}
					header={header()}
					mainContent={mainContent()}
					onClose={onRequestClose}
					footer={
						<div
							css={css`
								display: flex;
								align-items: flex-end;
								justify-content: space-between;
								flex: 1 0 0px;
							`}
						>
							{isLowMediaStorage && (
								<StorageLimitWarning
									mediaUsageDetails={mediaUsage}
									mediaUsagePercentage={mediaUsagePercentage}
								/>
							)}
							<Button
								css={css`
									margin-left: auto;
								`}
								isPrimary
								disabled={!selected?.id}
								onClick={() => {
									onSelect && onSelect(selected);
									setOpen(false);
								}}
							>
								{__('Choose', 'surecart')}
							</Button>
						</div>
					}
					sidebar={
						selected && (
							<div
								css={css`
									padding: 15px 0;
								`}
							>
								<Preview
									media={selected}
									onDeleted={() => setSelected(null)}
								/>
							</div>
						)
					}
				/>
			)}
		</Fragment>
	);
};
