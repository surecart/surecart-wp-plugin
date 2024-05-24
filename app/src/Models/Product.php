<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasImageSizes;
use SureCart\Models\Traits\HasPurchases;
use SureCart\Models\Traits\HasCommissionStructure;
use SureCart\Support\Contracts\PageModel;
use SureCart\Support\Currency;

/**
 * Price model
 */
class Product extends Model implements PageModel {
	use HasImageSizes, HasPurchases, HasCommissionStructure;

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
	 * Immediately sync with a post.
	 *
	 * @param bool $with_collections Whether to sync with collections.
	 *
	 * @return \WP_Post|\WP_Error
	 */
	protected function sync( $with_collections = false ) {
		\SureCart::sync()
			->product()
			->withCollections( $with_collections )
			->sync( $this );

		return $this;
	}

	/**
	 * Queue a sync process with a post.
	 *
	 * @return \SureCart\Background\QueueService
	 */
	protected function queueSync() {
		\SureCart::sync()
			->product()
			->queue( $this );

		return $this;
	}

	/**
	 * Get the attached post.
	 *
	 * @return int|false
	 */
	public function getPostAttribute() {
		return \SureCart::sync()->product()->post()->findByModelId( $this->id );
	}

	/**
	 * Create a new model
	 *
	 * @param array $attributes Attributes to create.
	 *
	 * @return $this|false
	 */
	protected function create( $attributes = array() ) {
		if ( ! wp_is_block_theme() ) {
			$attributes['metadata'] = array(
				...$attributes['metadata'] ?? array(),
				'wp_template_id' => apply_filters( 'surecart/templates/products/default', 'pages/template-surecart-product.php' ),
			);
		}

		return parent::create( $attributes );
	}

	/**
	 * Maybe queue a sync job if updated_at is different
	 * than the product post updated_at.
	 *
	 * @param string $value The updated_at value.
	 *
	 * @return void
	 */
	public function setUpdatedAtAttribute( $value ) {
		// queue the off-session sync job if the product updated_at is newer than the post updated_at.
		if ( ! empty( $this->post ) && ! empty( $this->post->updated_at ) && ! empty( $this->updated_at ) ) {
			if ( $this->updated_at > $this->post->updated_at ) {
				$this->queueSync();
			}
		}

		// set the attribute like normal.
		$this->attributes['updated_at'] = apply_filters( "surecart/$this->object_name/attributes/updated_at", $value, $this );
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
	 * Set the product collections attribute
	 *
	 * @param object $value Product collections.
	 * @return void
	 */
	public function setProductCollectionsAttribute( $value ) {
		$this->setCollection( 'product_collections', $value, ProductCollection::class );
	}

	/**
	 * Set the variants attribute.
	 *
	 * @param  object $value Array of price objects.
	 * @return void
	 */
	public function setVariantsAttribute( $value ) {
		$this->setCollection( 'variants', $value, Variant::class );
	}


	/**
	 * Set the variants attribute.
	 *
	 * @param  object $value Array of price objects.
	 * @return void
	 */
	public function setVariantOptionsAttribute( $value ) {
		$this->setCollection( 'variant_options', $value, VariantOption::class );
	}

	/**
	 * Set the featured product media attribute.
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setFeaturedProductMediaAttribute( $value ) {
		$this->setRelation( 'featured_product_media', $value, ProductMedia::class );
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
	 * Checkout Permalink.
	 *
	 * @return string
	 */
	public function getCheckoutPermalinkAttribute() {
		return $this->buyLink()->url();
	}

	/**
	 * Get the product permalink.
	 *
	 * @return string
	 */
	public function getPermalinkAttribute(): string {
		return ! empty( $this->post ) ? get_the_permalink( $this->post->ID ) : '';
	}

	/**
	 * Get the page title.
	 *
	 * @return string
	 */
	public function getPageTitleAttribute(): string {
		return $this->metadata->page_title ?? $this->name ?? '';
	}

	/**
	 * Get the meta description.
	 *
	 * @return string
	 */
	public function getMetaDescriptionAttribute(): string {
		return $this->metadata->meta_description ?? $this->description ?? '';
	}

	/**
	 * Return attached active prices.
	 *
	 * @return array
	 */
	public function getActivePricesAttribute() {
		$active_prices = array_values(
			array_filter(
				$this->prices->data ?? array(),
				function ( $price ) {
					return ! $price->archived;
				}
			)
		);

		usort(
			$active_prices,
			function ( $a, $b ) {
				if ( $a->position == $b->position ) {
					return 0;
				}
				return ( $a->position < $b->position ) ? -1 : 1;
			}
		);

		return $active_prices;
	}

	/**
	 * Return attached active prices.
	 */
	public function activeAdHocPrices() {
		return array_filter(
			$this->active_prices ?? array(),
			function ( $price ) {
				return $price->ad_hoc;
			}
		);
	}

	/**
	 * Returns the product media image attributes.
	 *
	 * @return object
	 */
	public function getFeaturedMediaAttribute() {
		$gallery = $this->gallery || [];
		if ( ! empty( $gallery ) ) {
			return $gallery[0];
		}
		$featured_product_media = $this->featured_product_media;

		return (object) array(
			'alt'   => $featured_product_media->media->alt ?? $this->title ?? $this->name ?? '',
			'title' => $featured_product_media->media->title ?? '',
			'src'   => $featured_product_media->media->url ?? $this->image_url ?? \SureCart::core()->assets()->getUrl() . '/images/placeholder.jpg',
		);
	}

	/**
	 * Get the JSON Schema Array
	 *
	 * @return array
	 */
	public function getJsonSchemaArray(): array {
		$active_prices = (array) $this->active_prices;

		$offers = array_map(
			function ( $price ) {
				return array(
					'@type'         => 'Offer',
					'price'         => Currency::maybeConvertAmount( $price->amount, $price->currency ),
					'priceCurrency' => $price->currency,
					'availability'  => 'https://schema.org/InStock',
				);
			},
			$active_prices ?? array()
		);

		return apply_filters(
			'surecart/product/json_schema',
			array(
				'@context'    => 'http://schema.org',
				'@type'       => 'Product',
				'name'        => $this->name,
				'image'       => $this->image_url ?? '',
				'description' => sanitize_text_field( $this->description ),
				'offers'      => $offers,
			),
			$this
		);
	}

	/**
	 * Get the product template id.
	 *
	 * @return string
	 */
	public function getTemplateIdAttribute(): string {
		if ( ! empty( $this->attributes['metadata']->wp_template_id ) ) {
			// we have a php file, switch to default.
			if ( wp_is_block_theme() && false !== strpos( $this->attributes['metadata']->wp_template_id, '.php' ) ) {
				return 'single-sc_product';
			}

			// this is acceptable.
			return $this->attributes['metadata']->wp_template_id;
		}
		return 'single-sc_product';
	}

	/**
	 * Get with sorted prices.
	 *
	 * @return this
	 */
	public function withSortedPrices() {
		if ( empty( $this->prices->data ) ) {
			return $this;
		}

		$filtered = clone $this;

		// Sort prices by position.
		usort(
			$filtered->prices->data,
			function ( $a, $b ) {
				return $a->position - $b->position;
			}
		);

		return $filtered;
	}

	/**
	 * Get product with acgive and sorted prices.
	 *
	 * @return this
	 */
	public function withActivePrices() {
		if ( empty( $this->prices->data ) ) {
			return $this;
		}

		$filtered = clone $this;

		// Filter out archived prices.
		$filtered->prices->data = array_values(
			array_filter(
				$filtered->prices->data ?? array(),
				function ( $price ) {
					return ! $price->archived;
				}
			)
		);

		return $filtered;
	}

	/**
	 * Get the first variant with stock.
	 *
	 * @return \SureCart\Models\Variant;
	 */
	public function getFirstVariantWithStockAttribute() {
		// stock is enabled.
		if ( $this->stock_enabled && ! $this->allow_out_of_stock_purchases && ! empty( $this->variants->data ) ) {
			foreach ( $this->variants->data as $variant ) {
				if ( $variant->available_stock > 0 ) {
					return $variant;
				}
			}
		}
		return $this->variants->data[0] ?? null;
	}

	/**
	 * Get the initial price.
	 *
	 * @return string
	 */
	public function getInitialPriceAttribute() {
		$prices        = $this->active_prices ?? array();
		$initial_price = $prices[0] ?? null;
		return $initial_price;
	}

	/**
	 * Get the initial amount.
	 *
	 * @return string
	 */
	public function getInitialAmountAttribute() {
		$initial_variant = $this->first_variant_with_stock;
		if ( ! empty( $initial_variant->amount ) ) {
			if ( ! empty( $initial_variant->amount ) ) {
				return $initial_variant->amount;
			}
			$prices        = $this->active_prices ?? [];
			$initial_price = $prices[0] ?? null;
			return $initial_price->amount ?? null;
		}
	}

	/**
	 * Get the scratch amount.
	 *
	 * @return string
	 */
	public function getScratchAmountAttribute() {
		$prices        = $this->active_prices ?? [];
		$initial_price = $prices[0] ?? null;
		return $initial_price->scratch_amount ?? null;
	}

	/**
	 * Get the scratch display amount.
	 *
	 * @return string
	 */
	public function getScratchDisplayAmountAttribute() {
		$prices        = $this->active_prices ?? array();
		$initial_price = $prices[0] ?? null;
		if ( empty( $initial_price->scratch_amount ) ) {
			return '';
		}
		return Currency::format( $initial_price->scratch_amount, $initial_price->currency );
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
	 * @return string
	 */
	public function getTemplatePartIdAttribute(): string {
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

	/**
	 * Get Template Content.
	 *
	 * @return string
	 */
	public function getTemplateContent(): string {
		return wp_is_block_theme() ?
		$this->template->content ?? '' :
		$this->template_part->content ?? '';
	}

	/**
	 * Get markup for a specific product image.
	 *
	 * @param integer $id  The image id.
	 * @param string  $size The image size.
	 *
	 * @return string
	 */
	public function getImageMarkup( $id, $size = 'full', $attr = array() ) {
		if ( is_int( $id ) ) {
			return wp_get_attachment_image( $id, 'large', false, $attr );
		}

		// get the first item that maches the id.
		$item = array_filter(
			$this->getAttribute( 'product_medias' )->data ?? array(),
			function ( $item ) use ( $id ) {
				return $item->id === $id;
			}
		);
		$item = array_shift( $item );

		// no item found.
		if ( empty( $item ) ) {
			return '';
		}

		return $item->getImageMarkup( $size, $attr );
	}

	/**
	 * Get the gallery attribute.
	 *
	 * Map the post gallery array to GalleryItem objects.
	 *
	 * @return GalleryItem[]
	 */
	public function getGalleryAttribute() {
		$gallery_items = $this->post->gallery ?? array();

		return array_map(
			function ( $gallery_item ) {
				// this is an attachment id.
				if ( is_int( $gallery_item->id ) ) {
					return new GalleryItem( $gallery_item );
				}

				// get the product media item that matches the id.
				$item = array_filter(
					$this->getAttribute( 'product_medias' )->data ?? array(),
					function ( $item ) use ( $gallery_item ) {
						return $item->id === $gallery_item->id;
					}
				);

				// get the first item.
				$item = array_shift( $item );
				if ( ! empty( $item ) ) {
					return new GalleryItem( $item );
				}

				return '';
			},
			$gallery_items
		);
	}

	/**
	 * Get the price display amount.
	 *
	 * @return array
	 */
	public function getDisplayAmountAttribute() {
		$initial_variant = $this->first_variant_with_stock;

		if ( ! empty( $initial_variant->amount ) ) {
			return Currency::format( $initial_variant->amount, $initial_variant->currency );
		}

		$prices        = $this->active_prices ?? [];
		$initial_price = $prices[0] ?? null;
		if ( empty( $initial_price ) ) {
			return '';
		}

		return Currency::format( $initial_price->amount, $initial_price->currency );
	}

	/**
	 * Get Price Range Display Amount.
	 *
	 * @return string
	 */
	public function getRangeDisplayAmountAttribute() {
		if ( ! $this->metrics || empty( $this->metrics->min_price_amount ) || empty( $this->metrics->max_price_amount ) ) {
			return '';
		}

		if ( $this->metrics->min_price_amount === $this->metrics->max_price_amount ) {
			return Currency::format( $this->metrics->min_price_amount, $this->metrics->currency );
		}

		return Currency::format( $this->metrics->min_price_amount, $this->metrics->currency ) . ' - ' .
			Currency::format( $this->metrics->max_price_amount, $this->metrics->currency );
	}

	/**
	 * Is the product on sale?
	 *
	 * @return array
	 */
	public function getIsOnSaleAttribute() {
		return $this->initial_price->is_on_sale ?? false;
	}
}
