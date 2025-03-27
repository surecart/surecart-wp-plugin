/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
	PluginDocumentSettingPanel,
	store as editorStore,
} from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { __experimentalConfirmDialog as ConfirmDialog } from '@wordpress/components';
import { useEffect, useState } from 'react';
import { addQueryArgs } from '@wordpress/url';
/**
 * The component to be rendered  as part of the plugin.
 */
export default () => {
	const [isOpen, setIsOpen] = useState(null);
	const post = useSelect((select) => {
		return select(editorStore).getCurrentPost();
	}, []);

	useEffect(() => {
		if (
			post?.type === 'sc_product' &&
			!post?.has_content_block &&
			isOpen === null // prevent multiple alerts
		) {
			setIsOpen(true);
		}
	}, [post?.has_content_block]);

	// If the post type is viewable, do not render my fill
	if (post?.type !== 'sc_product') {
		return null;
	}

	return (
		<>
			<PluginDocumentSettingPanel
				name="product-page-info"
				title={post?.title}
				className="product-page-info"
			>
				{__('This editor controls the content of the product page.')}
			</PluginDocumentSettingPanel>
			<ConfirmDialog
				isOpen={isOpen}
				onConfirm={() => {
					window.location.assign(
						addQueryArgs('site-editor.php', {
							postType: post?.block_template?.type,
							postId: post?.block_template?.id,
							canvas: 'edit',
						})
					);
				}}
				confirmButtonText={__('Edit Template', 'surecart')}
				cancelButtonText={__('Ignore', 'surecart')}
				onCancel={() => setIsOpen(false)}
			>
				<div
					css={css`
						max-width: 350px;
					`}
				>
					{__(
						'This product\'s template is missing the "Post Content" block. It must be added to display the content.'
					)}
				</div>
			</ConfirmDialog>
		</>
	);
};
