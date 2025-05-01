import { addQueryArgs } from '@wordpress/url';

/**
 * Get the page builder type and editor link based on the post.
 *
 * @param {Object} post The post object
 *
 * @return {Object} Object containing pageBuilder type and editorLink
 */
export const getPageBuilderLinks = (post) => {
	// Get edit post link
	const editPostLink = addQueryArgs(`${scData?.home_url}/wp-admin/post.php`, {
		post: post?.id,
		action: 'edit',
	});

	// Check for Elementor
	if (post?.meta?._elementor_edit_mode === 'builder') {
		return {
			pageBuilder: 'elementor',
			editorLink: addQueryArgs(`${scData?.home_url}/wp-admin/post.php`, {
				post: post?.id,
				action: 'elementor',
			}),
			editPostLink,
		};
	}

	// Check for Bricks builder
	if (window?.scData?.bricks?.editLink) {
		return {
			pageBuilder: 'bricks',
			editorLink: window?.scData?.bricks?.editLink,
			editPostLink,
		};
	}

	// Default to WordPress core editor
	return {
		pageBuilder: 'core',
		editorLink: editPostLink,
		editPostLink,
	};
};

export default getPageBuilderLinks;
