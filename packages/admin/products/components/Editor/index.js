/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalConfirmDialog as ConfirmDialog,
	Disabled,
	Modal,
	ToggleControl,
} from '@wordpress/components';
import { Suspense, useEffect, useState, memo } from '@wordpress/element';
import { parse, serialize } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { close, edit, settings } from '@wordpress/icons';
import { useDebounce } from '@wordpress/compose';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import initBlocks from '../../../components/block-editor/utils/init-blocks';
import BlockEditor from '../../../components/block-editor';
import PreviewBlocks from '../../../components/block-editor/PreviewBlocks';
import { ScTextarea } from '@surecart/components-react';

const MemoizedBlockEditor = memo(BlockEditor);

export default ({ product, updateProduct, loading }) => {
	if (!product) {
		return null;
	}
	const [cancelModal, setCancelModal] = useState(false);
	const [editorModal, setEditorModal] = useState(false);
	const [settingsModal, setSettingsModal] = useState(false);
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

	const editProductContent = (blocksData) => {
		updateProduct({
			content: serialize(blocksData),
		});
	};

	return (
		<>
			<Box
				title={__('Content', 'surecart')}
				loading={loading}
				header_action={
					<>
						<Button
							icon={settings}
							label={__('Editor Settings', 'surecart')}
							onClick={() => setSettingsModal(true)}
							showTooltip={true}
							css={css`
								margin-top: -20px;
								margin-bottom: -20px;
							`}
							disabled={loading}
							size="compact"
						/>
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
					</>
				}
			>
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
						onClick={() => setEditorModal(true)}
					>
						{blocks.length > 0 ? (
							<div
								css={css`
									border: 1px solid #e5e5e5;
									border-radius: 5px;
								`}
							>
								<PreviewBlocks blocks={blocks} />
							</div>
						) : (
							<Disabled onClick={() => setEditorModal(true)}>
								<ScTextarea
									placeholder={__(
										'Write your product details here.',
										'surecart'
									)}
									rows={2}
									resize="none"
								/>
							</Disabled>
						)}
					</div>
				</div>
			</Box>

			{settingsModal && (
				<Modal
					title={__('Editor Settings', 'surecart')}
					onRequestClose={() => setSettingsModal(false)}
				>
					<fieldset className="preferences-modal__section">
						<legend className="preferences-modal__section-legend">
							<h2 className="preferences-modal__section-title">
								{__('Allowed Blocks', 'surecart')}
							</h2>
						</legend>
						<div className="preferences-modal__section-content">
							{(
								surecartBlockEditorSettings[
									'surecart_all_block_prefixes'
								] || []
							).map((prefix) => (
								<div key={prefix}>
									<ToggleControl
										label={
											prefix.charAt(0).toUpperCase() +
											prefix.slice(1)
										}
										checked={true}
										onChange={() => {}}
									/>
								</div>
							))}
						</div>
					</fieldset>
				</Modal>
			)}

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
							padding-left: 18px;
							padding-right: 18px;

							.components-modal__header-heading {
								font-size: 16px;
								line-height: 24px;
							}
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
