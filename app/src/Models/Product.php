<?php

namespace SureCart\Models;

use SureCart\Support\Currency;

/**
 * Price model
 */
class Product extends Model {
	use Traits\HasImageSizes;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'products';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'product';

	/**
	 * Is this cachable?
	 *
	 * @var boolean
	 */
	protected $cachable = true;

	/**
	 * Clear cache when products are updated.
	 *
	 * @var string
	 */
	protected $cache_key = 'products_updated_at';

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
				'wp_template_id' => apply_filters( 'surecart/templates/products/default', 'pages/template-surecart-product.php' ),
			];
		}

		return parent::create( $attributes );
	}

	/**
	 * Image srcset.
	 *
	 * @return string
	 */
	public function getImageSrcsetAttribute() {
		if ( empty( $this->attributes['image_url'] ) ) {
			return '';
		}
		return $this->imageSrcSet( $this->attributes['image_url'] );
	}

	/**
	 * Get the image url for a specific size.
	 *
	 * @param integer $size The size.
	 *
	 * @return string
	 */
	public function getImageUrl( $size = 0 ) {
		if ( empty( $this->attributes['image_url'] ) ) {
			return '';
		}
		return $size ? $this->imageUrl( $this->attributes['image_url'], $size ) : $this->attributes['image_url'];
	}

	/**
	 * Set the prices attribute.
	 *
	 * @param  object $value Array of price objects.
	 * @return void
	 */
	public function setPricesAttribute( $value ) {
		$this->setCollection( 'prices', $value, Price::class );
	}

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setPurchaseAttribute( $value ) {
		$this->setRelation( 'purchase', $value, Purchase::class );
	}

	/**
	 * Set the product media attribute
	 *
	 * @param  string $value ProductMedia properties.
	 * @return void
	 */
	public function setProductMediasAttribute( $value ) {
		$this->setCollection( 'product_medias', $value, ProductMedia::class );
	}

	/**
	 * Buy link model
	 *
	 * @return \SureCart\Models\BuyLink
	 */
	public function buyLink() {
		return new BuyLink( $this );
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
		return trailingslashit( get_home_url() ) . trailingslashit( \SureCart::settings()->permalinks()->getBase( 'product_page' ) ) . $this->slug;
	}

	/**
	 * Get the page title.
	 *
	 * @return string
	 */
	public function getPageTitleAttribute() {
		return $this->metadata->page_title ?? $this->name;
	}

	/**
	 * Get the meta description.
	 *
	 * @return string
	 */
	public function getMetaDescriptionAttribute() {
		return $this->metadata->meta_description ?? $this->description;
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

	/**
	 * Get the product template id.
	 *
	 * @return string|false
	 */
	public function getTemplateIdAttribute() {
		if ( ! empty( $this->attributes['metadata']->wp_template_id ) ) {
			// we have a php file, switch to default.
			if ( wp_is_block_theme() && false !== strpos( $this->attributes['metadata']->wp_template_id, '.php' ) ) {
				return 'surecart/surecart//single-product';
			}

			// this is acceptable.
			return $this->attributes['metadata']->wp_template_id;
		}
		return 'surecart/surecart//single-product';
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
	 * Get the product template id.
	 *
	 * @return string|false
	 */
	public function getTemplatePartIdAttribute() {
		if ( ! empty( $this->attributes['metadata']->wp_template_part_id ) ) {
			return $this->attributes['metadata']->wp_template_part_id;
		}
		return 'surecart/surecart//product-info';
	}

	/**
	 * Get the product template part template.
	 *
	 * @return \WP_Template
	 */
	public function getTemplatePartAttribute() {
		return get_block_template( $this->getTemplatePartIdAttribute(), 'wp_template_part' );
	}
}

