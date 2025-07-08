/**
 * External dependencies.
 */
import { useSelect } from '@wordpress/data';

export function usePostTypeCheck(postTypes, postIdIncludes) {
	return useSelect(
		(select) => {
			const { getCurrentPostType, getCurrentPostId } =
				select('core/editor') || {};
			const postType = getCurrentPostType?.() || null;
			const postId = getCurrentPostId?.();

			return (
				postTypes.includes(postType) &&
				postIdIncludes.some((id) => postId?.includes(id))
			);
		},
		[postTypes, postIdIncludes]
	);
}
