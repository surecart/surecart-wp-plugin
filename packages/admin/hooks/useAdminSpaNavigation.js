import { useState, useEffect, useCallback } from 'react';
import { addQueryArgs, getQueryArgs } from '@wordpress/url';

/**
 * useAdminSpaNavigation — Reusable SPA navigation hook for SureCart admin pages.
 *
 * Uses pushState/popstate to navigate between list, create, and edit views
 * without full page reloads.
 *
 * @param {string} pageSlug - The admin page slug (e.g. 'sc-products', 'sc-product-collections').
 * @return {Object} Route state and navigation helpers.
 */
export default function useAdminSpaNavigation(pageSlug) {
	/**
	 * Parse the current URL into a route descriptor.
	 */
	const parseRoute = useCallback(() => {
		const args = getQueryArgs(window.location.href);
		return {
			action: args.action || null,
			id: args.id || null,
		};
	}, []);

	/**
	 * Build a URL from route params.
	 */
	const buildUrl = useCallback(
		(params) => {
			const base = { page: pageSlug };
			Object.entries(params).forEach(([key, value]) => {
				if (value !== null && value !== undefined && value !== '') {
					base[key] = value;
				}
			});
			return addQueryArgs('admin.php', base);
		},
		[pageSlug]
	);

	const [route, setRoute] = useState(parseRoute);

	// Re-sync route from URL when the pageSlug changes (cross-page SPA nav).
	useEffect(() => {
		setRoute(parseRoute());
	}, [pageSlug, parseRoute]);

	// Listen for browser back/forward.
	useEffect(() => {
		const onPopState = () => {
			setRoute(parseRoute());
		};
		window.addEventListener('popstate', onPopState);
		return () => window.removeEventListener('popstate', onPopState);
	}, [parseRoute]);

	/**
	 * Navigate to a new route via pushState (no page reload).
	 */
	const navigateTo = useCallback(
		(params) => {
			const url = buildUrl(params);
			window.history.pushState(params, '', url);
			setRoute({
				action: params.action || null,
				id: params.id || null,
			});
		},
		[buildUrl]
	);

	/**
	 * Navigate to the list page.
	 */
	const goToList = useCallback(() => {
		navigateTo({});
	}, [navigateTo]);

	/**
	 * Navigate to the create page.
	 */
	const goToCreate = useCallback(() => {
		navigateTo({ action: 'edit' });
	}, [navigateTo]);

	/**
	 * Navigate to edit a specific item.
	 *
	 * @param {string} id         - Item ID.
	 * @param {Object} [extra={}] - Extra query params.
	 */
	const goToEdit = useCallback(
		(id, extra = {}) => {
			navigateTo({ action: 'edit', id, ...extra });
		},
		[navigateTo]
	);

	return {
		action: route.action,
		id: route.id,
		isList: !route.action,
		isCreate: route.action === 'edit' && !route.id,
		isEdit: route.action === 'edit' && !!route.id,
		pageSlug,
		navigateTo,
		goToList,
		goToCreate,
		goToEdit,
	};
}
