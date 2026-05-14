import { useCallback, useMemo } from 'react';
import { getQueryArgs } from '@wordpress/url';
import { useHistory, useLocation } from '../router';

export default function (pageSlug) {
	const history = useHistory();
	const location = useLocation();

	const params = location?.params || {};
	const action = params.action || null;
	const id = params.id || null;

	const arrayParams = useMemo(() => {
		const search = location?.search || '';
		if (!search) return {};
		return getQueryArgs(`http://_${search}`);
	}, [location?.search]);

	const bulkDeleteIds = useMemo(() => {
		const raw = arrayParams.bulk_action_product_ids;
		if (!raw) return [];
		return Array.isArray(raw) ? raw : [raw];
	}, [arrayParams]);

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
	const goToBulkDelete = useCallback(
		(ids) =>
			navigateTo({
				action: 'delete',
				bulk_action_product_ids: ids,
			}),
		[navigateTo]
	);

	return useMemo(
		() => ({
			action,
			id,
			isList: !action,
			isCreate: action === 'edit' && !id,
			isEdit: action === 'edit' && !!id,
			isBulkDelete: action === 'delete',
			bulkDeleteIds,
			pageSlug,
			navigateTo,
			goToList,
			goToCreate,
			goToEdit,
			goToBulkDelete,
		}),
		[
			action,
			id,
			bulkDeleteIds,
			pageSlug,
			navigateTo,
			goToList,
			goToCreate,
			goToEdit,
			goToBulkDelete,
		]
	);
}
