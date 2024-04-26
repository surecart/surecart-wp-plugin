import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import FlatTermSelector from './FlatTermSelector';
import { Fragment } from '@wordpress/element';

export default ({ post, loading }) => {
	const taxonomies = useSelect(
		(select) => select(coreStore).getTaxonomies({ per_page: -1 }),
		[]
	);

	const visibleTaxonomies = (taxonomies ?? []).filter((taxonomy) =>
		taxonomy.types.includes(post?.type)
	);

	return visibleTaxonomies.map((taxonomy) => {
		const TaxonomyComponent = taxonomy.hierarchical
			? FlatTermSelector
			: FlatTermSelector;
		return (
			<Fragment key={`taxonomy-${taxonomy.slug}`}>
				<TaxonomyComponent
					slug={taxonomy.slug}
					post={post}
					loading={loading}
				/>
			</Fragment>
		);
	});
};
