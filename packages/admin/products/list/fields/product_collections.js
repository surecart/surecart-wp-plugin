/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/react';

// `elements` must be a static array — the bundled `@wordpress/dataviews/wp`
// silently drops filters whose `elements` is a function.
export default ({ elements, setView } = {}) => ({
	id: 'product_collections',
	label: __('Collections', 'surecart'),
	enableSorting: false,
	filterBy: { operators: ['isAny'] },
	elements: Array.isArray(elements) ? elements : [],
	getValue: ({ item }) =>
		(item?.product_collections?.data || []).map((c) => c.id),
	render: ({ item }) => {
		const itemCollections = item?.product_collections?.data || [];
		if (!itemCollections.length) return '-';

		const filterByCollection = (collectionId) => {
			if (!setView) return;
			setView((prev) => {
				const others = (prev.filters || []).filter(
					(f) => f.field !== 'product_collections'
				);
				return {
					...prev,
					page: 1,
					filters: [
						...others,
						{
							field: 'product_collections',
							operator: 'isAny',
							value: [collectionId],
						},
					],
				};
			});
		};

		return (
			<div
				css={css`
					display: flex;
					flex-wrap: wrap;
					gap: 4px;
				`}
			>
				{itemCollections.map((collection) =>
					setView ? (
						<button
							key={collection.id}
							type="button"
							onClick={() => filterByCollection(collection.id)}
							css={css`
								background: none;
								border: none;
								padding: 0;
								font: inherit;
								color: var(--sc-color-primary-500);
								cursor: pointer;
								text-decoration: none;
								&:hover {
									text-decoration: underline;
								}
							`}
						>
							{collection.name}
						</button>
					) : (
						<span key={collection.id}>{collection.name}</span>
					)
				)}
			</div>
		);
	},
});
