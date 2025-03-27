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
/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import initBlocks from '../../../components/block-editor/utils/init-blocks';
import PreviewBlocks from '../../../components/block-editor/PreviewBlocks';
import PreviewElementor from './PreviewElementor';
import { ScButton, ScIcon } from '@surecart/components-react';

export default ({ post, loading }) => {
	const [blocks, setBlocks] = useState([]);
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

	if (!post?.id) {
		return null;
	}

	// build post link.
	let editorLink = editPostLink;
	let pageBuilder = 'core';

	// is elementor.
	if (post?.meta?._elementor_edit_mode === 'builder') {
		pageBuilder = 'elementor';
		editorLink = addQueryArgs('/wp-admin/post.php', {
			post: post?.id,
			action: 'elementor',
		});
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
							onClick={() => {
								window.location.assign(editPostLink);
							}}
						>
							<ScIcon name="edit" slot="prefix" />
							{__('Edit Content', 'surecart')}
						</ScButton>
					</div>
				}
				header_action={
					<DropdownMenu
						controls={[
							[
								{
									icon: external,
									onClick: () =>
										window.location.assign(editPostLink),
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
									<div
										onClick={() => {
											window.location.assign(
												editPostLink
											);
										}}
									>
										<PreviewBlocks blocks={blocks} />
									</div>
								)}
							</div>
						</a>
					</div>
				)}
			</Box>
		</>
	);
};
