import { useBlockProps } from '@wordpress/block-editor';

export default ({ attributes }) => {
	const { height, images, show_thumbnails, thumbnails_per_page } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<sc-image-slider
			images={images}
			thumbnails={show_thumbnails}
			thumbnailsPerPage={thumbnails_per_page}
			style={{ '--sc-product-slider-height': height }}
			{...blockProps}
		></sc-image-slider>
	);
};
