<?php

namespace SureCart\Models;

use SureCart\Support\Contracts\PageModel;

/**
 * Holds Product Collection data.
 */
class ProductCollection extends Model implements PageModel {
	use Traits\HasImageSizes;

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
	public function getTemplatePartIdAttribute(): string {
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
	public function getTemplateIdAttribute(): string {
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
	public function getPermalinkAttribute(): string|false {
		if ( empty( $this->attributes['id'] ) ) {
			return false;
		}
		return trailingslashit( get_home_url() ) . trailingslashit( \SureCart::settings()->permalinks()->getBase( 'collection_page' ) ) . $this->slug;
	}

	/**
	 * Get the JSON Schema Array
	 *
	 * @return array
	 */
	public function getJsonSchemaArray(): array {
		return [];
	}

	/**
	 * Get the page title for SEO.
	 *
	 * @return string
	 */
	public function getPageTitleAttribute(): string {
		return $this->attributes['name'] ?? '';
	}

	/**
	 * Get the page description for SEO.
	 *
	 * @return string
	 */
	public function getMetaDescriptionAttribute(): string {
		return $this->attributes['description'] ?? '';
	}

	/**
	 * Get the image url for a specific size.
	 *
	 * @param integer $size The size.
	 *
	 * @return string
	 */
	public function getImageUrl( $size = 0 ) {
		if ( empty( $this->attributes['image']->url ) ) {
			return '';
		}

		return $size ? $this->imageUrl( $this->attributes['image']->url, $size ) : $this->attributes['image']->url;
	}
}
