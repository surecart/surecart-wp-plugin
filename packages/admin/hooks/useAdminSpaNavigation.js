/**
 * useAdminSpaNavigation — Thin shim over the SureCart admin router.
 *
 * Existed before the router landed; preserved for components that already
 * call `navigation.goToEdit(id)` etc. New code should use `useHistory`,
 * `useLocation`, and `useLink` from `../router` directly — they're modeled
 * after `@wordpress/router` and used the same way as in @wordpress/edit-site.
 *
 * @param {string} pageSlug - Admin page slug, kept on every URL we push.
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
