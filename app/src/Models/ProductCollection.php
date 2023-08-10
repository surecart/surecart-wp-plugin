<?php

namespace SureCart\Models;

use SureCart\Support\Currency;

/**
 * Holds Product Collection data.
 */
class ProductCollection extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'product_collections';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'product_collection';

	/**
	 * Is this cachable.
	 *
	 * @var boolean
	 */
	protected $cachable = true;

	/**
	 * Clear cache when products are updated.
	 *
	 * @var string
	 */
	protected $cache_key = 'product_collections_updated_at';

	/**
	 * Create a new model
	 *
	 * @param array $attributes Attributes to create.
	 *
	 * @return $this|false
	 */
	protected function create( $attributes = [] ) {
		if ( ! wp_is_block_theme() ) {
			$attributes['metadata'] = [
				...$attributes['metadata'] ?? [],
				'wp_template_id' => apply_filters( 'surecart/templates/collections/default', 'pages/template-surecart-collection.php' ),
			];
		}

		return parent::create( $attributes );
	}

	/**
	 * Get the product template
	 *
	 * @return \WP_Template
	 */
	public function getTemplateAttribute() {
		return get_block_template( $this->getTemplateIdAttribute() );
	}

	/**
	 * Get the product template part template.
	 *
	 * @return \WP_Template
	 */
	public function getTemplatePartAttribute() {
		return get_block_template( $this->getTemplatePartIdAttribute(), 'wp_template_part' );
	}

	/**
	 * Get the product template id.
	 *
	 * @return string|false
	 */
	public function getTemplatePartIdAttribute() {
		if ( ! empty( $this->attributes['metadata']->wp_template_part_id ) ) {
			return $this->attributes['metadata']->wp_template_part_id;
		}
		return 'surecart/surecart//product-collection-part';
	}

	/**
	 * Get the product template id.
	 *
	 * @return string|false
	 */
	public function getTemplateIdAttribute() {
		if ( ! empty( $this->attributes['metadata']->wp_template_id ) ) {
			// we have a php file, switch to default.
			if ( wp_is_block_theme() && false !== strpos( $this->attributes['metadata']->wp_template_id, '.php' ) ) {
				return 'surecart/surecart//product-collection';
			}

			// this is acceptable.
			return $this->attributes['metadata']->wp_template_id;
		}
		return 'surecart/surecart//product-collection';
	}

	/**
	 * Get the product permalink.
	 *
	 * @return string|false
	 */
	public function getPermalinkAttribute() {
		if ( empty( $this->attributes['id'] ) ) {
			return false;
		}
		return trailingslashit( get_home_url() ) . trailingslashit( \SureCart::settings()->permalinks()->getBase( 'collection_page' ) ) . $this->slug;
	}

	/**
	 * Return attached active prices.
	 *
	 * @return array
	 */
	public function activePrices() {
		$active_prices = array_values(
			array_filter(
				$this->prices->data ?? [],
				function( $price ) {
					return ! $price->archived;
				}
			)
		);

		usort(
			$active_prices,
			function( $a, $b ) {
				if ( $a->position == $b->position ) {
					return 0;
				}
				return ( $a->position < $b->position ) ? -1 : 1;
			}
		);

		return $active_prices;
	}

	/**
	 * Get the JSON Schema Array
	 *
	 * @return array
	 */
	protected function getJsonSchemaArray() {
		$active_prices = (array) $this->activePrices();

		$offers = array_map(
			function( $price ) {
				return [
					'@type'         => 'Offer',
					'price'         => Currency::maybeConvertAmount( $price->amount, $price->currency ),
					'priceCurrency' => $price->currency,
					'availability'  => 'https://schema.org/InStock',
				];
			},
			$active_prices ?? []
		);

		return apply_filters(
			'surecart/product/json_schema',
			[
				'@context'    => 'http://schema.org',
				'@type'       => 'Product',
				'name'        => $this->name,
				'image'       => $this->image_url ?? '',
				'description' => sanitize_text_field( $this->description ),
				'offers'      => $offers,
			],
			$this
		);
	}
}
