import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

import {
	PostTaxonomiesFlatTermSelector,
	PostTaxonomiesHierarchicalTermSelector,
} from '@wordpress/editor';
import Box from '../../../ui/Box';

export default ({ post, loading }) => {
	// get all taxonomies.
	const taxonomies = useSelect(
		(select) => select(coreStore).getTaxonomies({ per_page: -1 }),
		[]
	);

	// get all visible taxonomies for this post type.
	const visibleTaxonomies = (taxonomies ?? []).filter(
		(taxonomy) =>
			taxonomy.types.includes(post?.type) &&
			taxonomy?.slug !== 'sc_collection'
	);

	// render all taxonomies.
	return visibleTaxonomies.map((taxonomy) => {
		const TaxonomyComponent = taxonomy.hierarchical
			? PostTaxonomiesHierarchicalTermSelector
			: PostTaxonomiesFlatTermSelector;
		return (
			<Box key={taxonomy.slug} title={taxonomy?.name}>
				<TaxonomyComponent key={taxonomy.slug} slug={taxonomy.slug} />
			</Box>
		);
	});
};
