import VariantThumbnail from './VariantThumbnail';

// Cell renderer for the optional `media` column on variant rows.
export default ({ item }) => (
	<div className="sc-variant-cell">
		<VariantThumbnail variant={item} size={36} />
	</div>
);
