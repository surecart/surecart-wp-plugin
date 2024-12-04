import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

import { PostTaxonomiesFlatTermSelector } from '@wordpress/editor';
import { HierarchicalTermSelector } from './hierarchical-term-selector';
import Box from '../../../ui/Box';

export default ({ currentPost }) => {
	if (!currentPost) {
		return null;
	}
	// get all taxonomies.
	const taxonomies = useSelect(
		(select) => select(coreStore).getTaxonomies({ per_page: -1 }),
		[]
	);

	// get all visible taxonomies for this post type.
	const visibleTaxonomies = (taxonomies ?? [])
		.filter(
			(taxonomy) =>
				taxonomy.types.includes(currentPost?.type) &&
				taxonomy?.slug !== 'sc_collection'
		)
		?.sort((a, b) => a?.name?.localeCompare(b?.name));

	// render all taxonomies.
	return visibleTaxonomies.map((taxonomy) => {
		const TaxonomyComponent = taxonomy.hierarchical
			? HierarchicalTermSelector
			: PostTaxonomiesFlatTermSelector;
		return (
			<Box key={taxonomy.slug} title={taxonomy?.name}>
				<TaxonomyComponent key={taxonomy.slug} slug={taxonomy.slug} />
			</Box>
		);
	});
};
