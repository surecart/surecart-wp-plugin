/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { DropdownMenu } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { parse } from '@wordpress/blocks';
import { moreHorizontal, external } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import initBlocks from '../../../components/block-editor/utils/init-blocks';
import PreviewBlocks from '../../../components/block-editor/PreviewBlocks';
import PreviewElementor from './PreviewElementor';
import { ScButton, ScIcon } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import Confirm from '../../../components/confirm';

export default ({ post, loading, onSave, error, setError }) => {
	const [blocks, setBlocks] = useState([]);
	const [confirm, setConfirm] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const hasDirtyRecords = useSelect((select) => {
		const { __experimentalGetDirtyEntityRecords } = select(coreStore);
		const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();
		return dirtyEntityRecords.length > 0;
	}, []);

	const editPostLink = addQueryArgs('/wp-admin/post.php', {
		post: post?.id,
		action: 'edit',
	});

	useEffect(() => {
		const unregisterBlocks = initBlocks();
		return () => {
			unregisterBlocks();
		};
	}, []);

	useEffect(() => {
		const parsedContent = parse(post?.content ?? '');
		setBlocks(parsedContent);
	}, [post?.content]);

	// bail on error.
	useEffect(() => {
		if (error) {
			setIsSaving(false);
		}
	}, [error]);

	if (!post?.id) {
		return null;
	}

	// Determine editor configuration
	const { editorLink, pageBuilder } =
		post?.meta?._elementor_edit_mode === 'builder'
			? {
					pageBuilder: 'elementor',
					editorLink: addQueryArgs('/wp-admin/post.php', {
						post: post?.id,
						action: 'elementor',
					}),
			  }
			: {
					pageBuilder: 'core',
					editorLink: editPostLink,
			  };

	/**
	 * Handle the navigateion request.
	 */
	const onNavigate = (type) => {
		// show notice if has any dirty records on page.
		if (hasDirtyRecords) {
			setConfirm(true);
			return;
		}

		navigate(type);
	};

	/**
	 * Navigate to the editor or post.
	 */
	const navigate = (type = 'editor') => {
		if (type === 'editor') {
			window.location.assign(editorLink);
		} else {
			window.location.assign(editPostLink);
		}
	};

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
							onClick={() => onNavigate('editor')}
						>
							<ScIcon name="maximize" slot="prefix" />
							{__('Open Content Designer', 'surecart')}
						</ScButton>
					</div>
				}
				header_action={
					<DropdownMenu
						controls={[
							[
								{
									icon: external,
									onClick: () => onNavigate('post'),
									title: __('Go to editor', 'surecart'),
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
				}
			>
				{blocks.length > 0 && (
					<div
						css={css`
							cursor: pointer;
						`}
					>
						<a
							css={css`
								display: block;
							`}
							role="button"
							tabIndex={0}
							href={editorLink}
						>
							<div
								css={css`
									border: 1px solid #e5e5e5;
									border-radius: 5px;
								`}
							>
								{pageBuilder === 'elementor' && (
									<PreviewElementor />
								)}
								{pageBuilder === 'core' && (
									<div onClick={() => onNavigate('editor')}>
										<PreviewBlocks blocks={blocks} />
									</div>
								)}
							</div>
						</a>
					</div>
				)}
			</Box>
			<Confirm
				open={confirm}
				loading={isSaving}
				onConfirm={async () => {
					setIsSaving(true);
					try {
						await onSave();
						navigate('editor');
					} catch (error) {
						setIsSaving(false);
					}
				}}
				confirmButtonText={__('Save and go to editor', 'surecart')}
				cancelButtonText={__('Cancel', 'surecart')}
				onRequestClose={() => {
					if (isSaving) {
						return;
					}
					setConfirm(false);
				}}
			>
				{__(
					'Save your changes before going to the editor?',
					'surecart'
				)}
			</Confirm>
		</>
	);
};
