/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	Disabled,
	__experimentalConfirmDialog as ConfirmDialog,
	Modal,
} from '@wordpress/components';
import { Suspense, useEffect, useState } from '@wordpress/element';
import { parse, serialize } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { close, edit } from '@wordpress/icons';
import { useDispatch } from '@wordpress/data';
import { useDebounce } from '@wordpress/compose';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import initBlocks from '../../../components/block-editor/utils/init-blocks';
import BlockEditor from '../../../components/block-editor';
import PreviewBlocks from '../../../components/block-editor/PreviewBlocks';
import { ScText } from '@surecart/components-react';

export default ({ product, loading }) => {
	if (!product) {
		return null;
	}
	const postId = product?.post?.ID;
	const { editEntityRecord } = useDispatch(coreStore);
	const [cancelModal, setCancelModal] = useState(false);
	const [editorModal, setEditorModal] = useState(false);
	const [blocks, setBlocks] = useState([]);
	const [initialBlocks, setInitialBlocks] = useState([]);

	useEffect(() => {
		const unregisterBlocks = initBlocks();

		return () => {
			unregisterBlocks();
		};
	}, []);

	useEffect(() => {
		const parsedContent = parse(product?.post?.post_content ?? []);
		setBlocks(parsedContent);
		setInitialBlocks(parsedContent);
	}, [product?.post?.post_content]);

	const debouncedEditEntityRecord = useDebounce((changedBlocks) => {
		editPostContent(changedBlocks);
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
			editPostContent(blocks);
		}

		setEditorModal(false);
	};

	const onSave = () => {
		if (!blocks) {
			setEditorModal(false);
			return;
		}

		editPostContent(blocks);
		setInitialBlocks(blocks);
		setEditorModal(false);
	};

	const editPostContent = (blocksData) => {
		editEntityRecord('postType', 'sc_product', postId, {
			content: serialize(blocksData),
			blocks: blocksData,
			selection: undefined,
		});
	};

	return (
		<>
			<Box
				title={__('Content', 'surecart')}
				loading={loading}
				header_action={
					<Button
						icon={edit}
						label={__('Open Content Designer', 'surecart')}
						onClick={() => setEditorModal(true)}
						showTooltip={true}
						css={css`
							margin-top: -20px;
							margin-bottom: -20px;
						`}
						disabled={loading}
						size="compact"
					/>
				}
			>
				<div
					css={css`
						border: 1px solid #e5e5e5;
						border-radius: 5px;
						min-height: 50px;
						cursor: pointer;
						overflow-y: auto;
						overflow-x: hidden;
						max-height: 400px;
					`}
				>
					<div
						css={css`
							padding: 10px 20px;
							display: block;
						`}
						role="button"
						tabIndex={0}
						onClick={() => setEditorModal(true)}
					>
						{blocks.length > 0 ? (
							<PreviewBlocks blocks={blocks} />
						) : (
							<ScText
								as="p"
								css={css`
									color: var(--sc-color-gray-500);
								`}
							>
								{__(
									'Write your product details here.',
									'surecart'
								)}
							</ScText>
						)}
					</div>
				</div>
			</Box>

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
							padding: 8px 32px 8px;
							border-bottom: 1px solid var(--sc-color-gray-300);
						}

						.components-modal__content {
							padding: 0;
						}
					`}
					title={__('Content', 'surecart')}
					shouldCloseOnClickOutside={false}
					shouldCloseOnEsc={false}
					isDismissible={false}
					onKeyDown={(event) => {
						if (event.code === 'Escape' || event.key === 'Escape') {
							onCancel();
						}
					}}
					headerActions={
						<Button
							size="small"
							onClick={onCancel}
							icon={close}
							label={__('Close', 'surecart')}
						/>
					}
				>
					<Suspense
						fallback={null}
						css={css`
							width: 100%;
						`}
					>
						<BlockEditor
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
