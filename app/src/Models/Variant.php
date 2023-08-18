<?php

namespace SureCart\Models;

/**
 * Variant model
 */

class Variant extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'variants';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'variant';

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setProductAttribute( $value ) {
		$this->setRelation( 'product', $value, Product::class );
	}

	/**
	 * Set the image attribute
	 *
	 * @param  string $value Image properties.
	 * @return void
	 */
	public function setImageAttribute( $value ) {
		$this->setRelation( 'image', $value, Media::class );
	}

	/**
	 * Get the image url.
	 *
	 * TODO: Remove this when we have image url from the API.
	 *
	 * @return string|null
	 */
	public function getImageUrlAttribute() {
		// Find image from media, by this image id, then get the url.
		if ( ! empty( $this->image->url ) ) return $this->image->url;

		// If image url is empty, then check media by this image.
		$media = (new Media())->find( $this->image );

		return $media->url ?? null;
	}
}
