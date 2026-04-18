/**
 * useAdminSpaNavigation — SPA navigation helper for admin list/edit pages.
 *
 * Wraps `useHistory` / `useLocation` (modeled after `@wordpress/router`,
 * same API as `@wordpress/edit-site`) to give list/edit pages a single
 * `navigation` object with `isList` / `isEdit` flags and `goToList`,
 * `goToCreate`, `goToEdit` helpers. Every pushed URL keeps `page={pageSlug}`.
 *
 * Used by `createListEditApp` to route between the list and edit views,
 * and passed down as `navigation` to both components.
 *
 * @param {string} pageSlug Admin page slug (e.g. 'sc-products').
 */
import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from '../router';

export default function useAdminSpaNavigation(pageSlug) {
	const history = useHistory();
	const location = useLocation();

	const params = location?.params || {};
	const action = params.action || null;
	const id = params.id || null;

	const buildParams = useCallback(
		(next) => {
			const merged = { page: pageSlug };
			Object.entries(next).forEach(([key, value]) => {
				if (value !== null && value !== undefined && value !== '') {
					merged[key] = value;
				}
			});
			return merged;
		},
		[pageSlug]
	);

	const navigateTo = useCallback(
		(next) => history.push(buildParams(next)),
		[history, buildParams]
	);

	const goToList = useCallback(() => navigateTo({}), [navigateTo]);
	const goToCreate = useCallback(
		() => navigateTo({ action: 'edit' }),
		[navigateTo]
	);
	const goToEdit = useCallback(
		(editId, extra = {}) =>
			navigateTo({ action: 'edit', id: editId, ...extra }),
		[navigateTo]
	);

	return useMemo(
		() => ({
			action,
			id,
			isList: !action,
			isCreate: action === 'edit' && !id,
			isEdit: action === 'edit' && !!id,
			pageSlug,
			navigateTo,
			goToList,
			goToCreate,
			goToEdit,
		}),
		[action, id, pageSlug, navigateTo, goToList, goToCreate, goToEdit]
	);
}
