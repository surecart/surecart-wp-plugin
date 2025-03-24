/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalConfirmDialog as ConfirmDialog,
	Modal,
	DropdownMenu,
} from '@wordpress/components';
import { store as coreStore, useEntityRecord } from '@wordpress/core-data';
import { Suspense, useEffect, useState, memo } from '@wordpress/element';
import { parse, serialize } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import {
	moreHorizontal,
	close,
	settings,
	external,
	fullscreen,
} from '@wordpress/icons';
import { useDebounce } from '@wordpress/compose';
import { addQueryArgs } from '@wordpress/url';
/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import initBlocks from '../../../components/block-editor/utils/init-blocks';
import BlockEditor from '../../../components/block-editor';
import PreviewBlocks from '../../../components/block-editor/PreviewBlocks';
import { ScButton, ScIcon } from '@surecart/components-react';
import Settings from './Settings';
import { useSelect } from '@wordpress/data';
import { ExternalLink } from '@wordpress/components';

const MemoizedBlockEditor = memo(BlockEditor);

export default ({ post, updatePost, loading }) => {
	const [cancelModal, setCancelModal] = useState(false);
	const [editorModal, setEditorModal] = useState(false);
	const [settingsModal, setSettingsModal] = useState(false);
	const [blocks, setBlocks] = useState([]);
	const [initialBlocks, setInitialBlocks] = useState([]);
	const {
		editedRecord: { surecart_product_editor_mode: editorMode },
	} = useEntityRecord('root', 'site');

	const editPostLink = addQueryArgs('/wp-admin/post.php', {
		post: post?.id,
		action: 'edit',
	});

	const openEditor = (e) => {
		e.preventDefault();
		if (editorMode === 'external') {
			window.location.assign(editPostLink);
		} else {
			setEditorModal(true);
		}
	};

	useEffect(() => {
		const unregisterBlocks = initBlocks();

		return () => {
			unregisterBlocks();
		};
	}, []);

	const canEditSettings = useSelect((select) =>
		select(coreStore).canUser('update', {
			kind: 'root',
			name: 'site',
		})
	);

	useEffect(() => {
		const parsedContent = parse(post?.content ?? '');
		setBlocks(parsedContent);
		setInitialBlocks(parsedContent);
	}, [post?.content]);

	const debouncedEditEntityRecord = useDebounce((changedBlocks) => {
		editProductContent(changedBlocks);
	}, 50);

	const onChange = (changedBlocks) => {
		setBlocks(changedBlocks);
		debouncedEditEntityRecord(changedBlocks);
	};

	const onCancel = () => {
		if (JSON.stringify(blocks) !== JSON.stringify(initialBlocks)) {
			setCancelModal(true);
			return;
		}

		onCancelConfirm();
	};

	const onCancelConfirm = () => {
		setBlocks(initialBlocks);
		debouncedEditEntityRecord(initialBlocks);
		setCancelModal(false);
		setEditorModal(false);
	};

	const handleClose = () => {
		const blocks = debouncedEditEntityRecord.flush();
		if (blocks) {
			editProductContent(blocks);
		}

		setEditorModal(false);
	};

	const onSave = () => {
		if (!blocks) {
			setEditorModal(false);
			return;
		}

		editProductContent(blocks);
		setInitialBlocks(blocks);
		setEditorModal(false);
	};

	const editProductContent = (blocksData) =>
		updatePost({
			content: serialize(blocksData),
		});

	if (!post?.id) {
		return null;
	}

	return (
		<>
			<Box
				title={__('Content', 'surecart')}
				loading={loading}
				footer={
					<div>
						<ScButton
							type="default"
							size="medium"
							css={css`
								margin-top: -20px;
								margin-bottom: -20px;
							`}
							onClick={openEditor}
							href={editPostLink}
						>
							<ScIcon name="maximize" slot="prefix" />
							{__('Open Content Designer', 'surecart')}
							{editorMode === 'external' && (
								<ScIcon name="external-link" slot="suffix" />
							)}
						</ScButton>
					</div>
				}
				header_action={
					canEditSettings && (
						<DropdownMenu
							controls={[
								[
									{
										icon: external,
										onClick: () =>
											window.location.assign(
												editPostLink
											),
										title: __(
											'Go to Full Editor',
											'surecart'
										),
									},
									{
										icon: fullscreen,
										onClick: () => setEditorModal(true),
										title: __(
											'Open Quick Editor',
											'surecart'
										),
									},
								],
								[
									{
										icon: settings,
										onClick: () => setSettingsModal(true),
										title: __(
											'Editor Settings',
											'surecart'
										),
									},
								],
							]}
							css={css`
								margin-top: -20px;
								margin-bottom: -20px;
							`}
							icon={moreHorizontal}
							label={__('More Actions', 'surecart')}
							popoverProps={{
								placement: 'bottom-end',
							}}
						/>
					)
				}
			>
				{blocks.length > 0 && (
					<div
						css={css`
							cursor: pointer;
						`}
					>
						<div
							css={css`
								display: block;
							`}
							role="button"
							tabIndex={0}
							onClick={openEditor}
						>
							<div
								css={css`
									border: 1px solid #e5e5e5;
									border-radius: 5px;
								`}
							>
								<PreviewBlocks blocks={blocks} />
							</div>
						</div>
					</div>
				)}
			</Box>

			<Settings
				open={settingsModal}
				onRequestClose={() => setSettingsModal(false)}
			/>

			{editorModal && (
				<Modal
					css={css`
						width: 100%;
						height: 100%;
						max-height: calc(100% - 40px);
						margin: 24px;
						border-radius: 8px;
						overflow: hidden;

						.components-modal__content {
							overflow: hidden !important;
							margin-top: 54px;
						}

						.components-modal__header {
							height: 60px;
							border-bottom: 1px solid #ccc;
							padding: 18px;

							.components-modal__header-heading {
								font-size: 16px;
								line-height: 24px;
							}
						}

						.components-modal__content {
							padding: 0;
						}
					`}
					title={__('Content Designer', 'surecart')}
					shouldCloseOnClickOutside={false}
					shouldCloseOnEsc={false}
					isDismissible={false}
					onKeyDown={(event) => {
						if (event.code === 'Escape' || event.key === 'Escape') {
							onCancel();
						}
					}}
					headerActions={
						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 2em;
							`}
						>
							<ExternalLink
								href={editPostLink}
								css={css`
									font-size: 12px;
									color: #666;

									.components-external-link__contents {
										text-decoration: none;
									}
								`}
								onClick={(e) => {
									e.preventDefault();
									setEditorModal(false);
									window.location.assign(editPostLink);
								}}
							>
								{__('Launch Full Editor', 'surecart')}
							</ExternalLink>
							<Button
								size="small"
								onClick={onCancel}
								icon={close}
								label={__('Close', 'surecart')}
							/>
						</div>
					}
				>
					<Suspense
						fallback={null}
						css={css`
							width: 100%;
						`}
					>
						<MemoizedBlockEditor
							initialBlocks={initialBlocks}
							onInput={onChange}
							onChange={onChange}
							onSave={onSave}
							onClose={handleClose}
							onCancel={onCancel}
							blocks={blocks}
							setBlocks={setBlocks}
							name={'surecart-block-editor'}
						/>
					</Suspense>
				</Modal>
			)}

			<ConfirmDialog
				isOpen={cancelModal}
				onConfirm={onCancelConfirm}
				onCancel={() => setCancelModal(false)}
			>
				{__(
					'Are you sure you want to cancel? Any unsaved changes will be lost.',
					'surecart'
				)}
			</ConfirmDialog>
		</>
	);
};
