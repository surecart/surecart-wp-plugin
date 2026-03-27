/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';

export function useAllowSwitchingTemplates(postId, postType) {
	return useSelect(
		(select) => {
			const { getEntityRecord, getEntityRecords } = select(coreStore);
			const siteSettings = getEntityRecord('root', 'site');
			const templates = getEntityRecords('postType', 'wp_template', {
				per_page: -1,
			});
			const isPostsPage = +postId === siteSettings?.page_for_posts;
			// If current page is set front page or posts page, we also need
			// to check if the current theme has a template for it. If not
			const isFrontPage =
				postType === 'page' &&
				+postId === siteSettings?.page_on_front &&
				templates?.some(({ slug }) => slug === 'front-page');
			return !isPostsPage && !isFrontPage;
		},
		[postId, postType]
	);
}

function useTemplates(postType) {
	return useSelect(
		(select) =>
			select(coreStore).getEntityRecords('postType', 'wp_template', {
				per_page: -1,
				post_type: postType,
			}),
		[postType]
	);
}

export function useAvailableTemplates(postId, postType) {
	const currentTemplateSlug = useCurrentTemplateSlug(postId, postType);
	const allowSwitchingTemplate = useAllowSwitchingTemplates(postId, postType);
	const templates = useTemplates(postType);
	return useMemo(
		() =>
			allowSwitchingTemplate &&
			templates?.filter(
				(template) => !!template.content.raw // Skip empty templates.
			),
		[templates, allowSwitchingTemplate]
	);
}

export function useCurrentTemplateSlug(postId, postType) {
	const templates = useTemplates(postType);
	const entityTemplate = useSelect(
		(select) => {
			const post = select(coreStore).getEditedEntityRecord(
				'postType',
				postType,
				postId
			);
			return post?.template;
		},
		[postType, postId]
	);

	if (!entityTemplate) {
		return;
	}
	// If a page has a `template` set and is not included in the list
	// of the theme's templates, do not return it, in order to resolve
	// to the current theme's default template.
	return templates?.find((template) => template.slug === entityTemplate)
		?.slug;
}
