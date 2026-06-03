import VariantThumbnail from '../VariantThumbnail';

export default ({ item }) => (
	<div className="sc-variant-cell">
		<VariantThumbnail variant={item} size={36} />
	</div>
);
