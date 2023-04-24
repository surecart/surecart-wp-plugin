export default ({ attributes }) => {
	const { height, images, show_thumbnails, thumbnails_per_page } = attributes;

	return (
		<sc-image-slider
			images={images}
			thumbnails={show_thumbnails}
			thumbnailsPerPage={thumbnails_per_page}
			style={{ '--sc-product-slider-height': height }}
		></sc-image-slider>
	);
};
