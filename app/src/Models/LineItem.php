<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCheckout;
use SureCart\Models\Traits\HasPrice;
use SureCart\Models\Traits\HasProduct;

/**
 * Price model
 */
class LineItem extends Model {
	use HasPrice;
	use HasCheckout;
	use HasProduct;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'line_items';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'line_item';

	/**
	 * Set the variant attribute.
	 *
	 * @param  string $value Variant properties.
	 * @return void
	 */
	public function setVariantAttribute( $value ) {
		$this->setRelation( 'variant', $value, Variant::class );
	}

	/**
	 * Upsell a line item.
	 *
	 * @param array $attributes The attributes to update.
	 * @return \WP_Error|mixed
	 */
	protected function upsell( $attributes = [] ) {
		if ( $this->fireModelEvent( 'upselling' ) === false ) {
			return false;
		}

		$updated = $this->makeRequest(
			[
				'method' => 'POST',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $attributes,
				],
			],
			'line_items/upsell'
		);

		if ( $this->isError( $updated ) ) {
			return $updated;
		}

		$this->resetAttributes();

		$this->fill( $updated );

		$this->fireModelEvent( 'upsold' );

		// clear account cache.
		if ( $this->cachable || $this->clears_account_cache ) {
			\SureCart::account()->clearCache();
		}

		return $this;
	}

	/**
	 * Get the line item image
	 */
	public function getImageAttribute() {
		// if we have a variant, use the variant image.
		if ( ! empty( $this->variant ) && is_a( $this->variant, Variant::class ) && ! empty( (array) $this->variant->line_item_image ) ) {
			return $this->variant->line_item_image;
		}

		// if we have a product, use the product image.
		if ( isset( $this->price->product->line_item_image ) ) {
			return $this->price->product->line_item_image;
		}

		return null;
	}
}
