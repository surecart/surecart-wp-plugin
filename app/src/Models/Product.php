<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasImageSizes;
use SureCart\Models\Traits\HasPurchases;
use SureCart\Models\Traits\HasCommissionStructure;
use SureCart\Support\Contracts\GalleryItem;
use SureCart\Support\Contracts\PageModel;
use SureCart\Support\Currency;

/**
 * Price model
 */
class Product extends Model implements PageModel {
	use HasImageSizes;
	use HasPurchases;
	use HasCommissionStructure;

	/**
	 * These always need to be fetched during create/update in order to sync with post model.
	 *
	 * @var array
	 */
	protected $sync_expands = array( 'prices', 'product_medias', 'product_media.media', 'variants', 'variant_options', 'product_collections', 'featured_product_media' );

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
	 * Delete the synced post.
	 *
	 * @param string $id The id of the model to delete.
	 * @return \SureCart\Models\Product
	 */
	protected function deleteSynced( $id = '' ) {
		$id = ! empty( $id ) ? $id : $this->id;
		\SureCart::sync()
			->product()
			->delete( $id );

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
	 * Maybe queue a sync job if updated_at is different
	 * than the product post updated_at.
	 *
	 * @return \SureCart\Background\QueueService|false Whether the sync was queued.
	 */
	protected function maybeQueueSync() {
		// we don't have an updated_at.
		if ( empty( $this->updated_at ) ) {
			return false;
		}

		// we don't have a post.
		if ( empty( $this->post ) ) {
			return false;
		}

		// we don't have a product updated_at.
		if ( empty( $this->post->product->updated_at ) ) {
			return false;
		}

		if ( $this->updated_at <= $this->post->product->updated_at ) {
			return false;
		}

		return $this->queueSync();
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
		// always expand these on create since we need to sync with the post.
		$this->withSyncableExpands();

		// create the model.
		$created = parent::create( $attributes );
		if ( is_wp_error( $created ) ) {
			return $created;
		}

		// sync with the post.
		$this->sync();

		// return.
		return $this;
	}

	/**
	 * Update a model
	 *
	 * @param array $attributes Attributes to update.
	 *
	 * @return $this|false
	 */
	protected function update( $attributes = array() ) {
		// always expand these on update since we need to sync with the post.
		$this->withSyncableExpands();

		// update the model.
		$updated = parent::update( $attributes );
		if ( is_wp_error( $updated ) ) {
			return $updated;
		}

		// sync with the post.
		$this->sync();

		// return.
		return $this;
	}

	/**
	 * Update a model
	 *
	 * @param string $id The id of the model to delete.
	 * @return $this|false
	 */
	protected function delete( $id = '' ) {
		// delete the model.
		$deleted = parent::delete( $id );

		// check for errors.
		if ( is_wp_error( $deleted ) ) {
			return $deleted;
		}

		// delete the post.
		$this->deleteSynced( $id );

		// return.
		return $this;
	}

	/**
	 * The model with the expanded items needed for syncing.
	 *
	 * @return \SureCart\Models\Product
	 */
	protected function withSyncableExpands() {
		return $this->with( $this->sync_expands );
	}

	/**
	 * Find the model for syncing.
	 *
	 * @param string $id The id of the model to find.
	 *
	 * @return \SureCart\Models\Product
	 */
	protected function findSyncable( $id ) {
		return $this->withSyncableExpands()->find( $id );
	}

	/**
	 * Check if model has syncable expands as properties
	 *
	 * @return bool
	 */
	protected function getHasSyncableExpandsAttribute() {
		foreach ( $this->sync_expands as $expand ) {
			// if expand contains a ., let's ignore it for now.
			if ( false !== strpos( $expand, '.' ) ) {
				return true;
			}
			if ( ! isset( $this->$expand ) ) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Get the sync expands.
	 *
	 * @return array
	 */
	protected function getSyncExpands() {
		return $this->sync_expands;
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
		$this->attributes['updated_at'] = apply_filters( "surecart/$this->object_name/attributes/updated_at", $value, $this );
		$this->maybeQueueSync();
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
	 * Get the has multiple prices attribute.
	 *
	 * @return boolean
	 */
	public function getHasMultiplePricesAttribute() {
		return count( $this->active_prices ) > 1;
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
	 * Get the featured image attribute.
	 *
	 * @return SureCart\Support\Contracts\GalleryItem|null;
	 */
	public function getFeaturedImageAttribute() {
		$gallery = array_values( $this->gallery ?? array() );

		if ( ! empty( $gallery ) ) {
			return $gallery[0];
		}
		if ( empty( $this->featured_product_media ) ) {
			return null;
		}
		if ( ! is_a( $this->featured_product_media, \SureCart\Models\ProductMedia::class ) ) {
			return null;
		}
		return new GalleryItemProductMedia( $this->featured_product_media );
	}

	/**
	 * Returns the product media image attributes.
	 *
	 * @return SureCart\Support\Contracts\GalleryItem|null;
	 */
	public function getFeaturedMediaAttribute() {
		return $this->featured_product_image;
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
			$prices        = $this->active_prices ?? array();
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
		$prices        = $this->active_prices ?? array();
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
	 * Get the gallery attribute.
	 *
	 * Map the post gallery array to GalleryItem objects.
	 *
	 * @return GalleryItem[]
	 */
	public function getGalleryAttribute() {
		$gallery_items = $this->post->gallery ?? array();

		return array_filter(
			array_map(
				function ( $gallery_item ) {
					// force object.
					$gallery_item = (object) $gallery_item;

					// this is an attachment id.
					if ( is_int( $gallery_item->id ) ) {
						return new GalleryItemAttachment( $gallery_item->id );
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
						return new GalleryItemProductMedia( $item );
					}

					return null;
				},
				$gallery_items
			)
		);
	}

	/**
	 * Get the price display amount.
	 *
	 * @return array
	 */
	public function getDisplayAmountAttribute() {
		$prices = $this->active_prices ?? array();

		// only if we have one price.
		if ( count( $prices ) === 1 ) {
			$initial_variant = $this->first_variant_with_stock;
			if ( ! empty( $initial_variant->amount ) ) {
				return Currency::format( $initial_variant->amount, $initial_variant->currency );
			}
		}

		// we don't have an initial price.
		if ( empty( $this->initial_price ) ) {
			return '';
		}

		// the initial price is ad hoc.
		if ( $this->initial_price->ad_hoc ) {
			return esc_html__( 'Custom Amount', 'surecart' );
		}

		// return the formatted amount.
		return Currency::format( $this->initial_price->amount, $this->initial_price->currency );
	}

	/**
	 * Get Price Range Display Amount.
	 *
	 * @return string
	 */
	public function getRangeDisplayAmountAttribute() {
		// there are no metrics.
		if ( ! $this->metrics || empty( $this->metrics->min_price_amount ) || empty( $this->metrics->max_price_amount ) ) {
			return '';
		}

		// the min and max are the same.
		if ( $this->metrics->min_price_amount === $this->metrics->max_price_amount ) {
			return Currency::format( $this->metrics->min_price_amount, $this->metrics->currency );
		}

		// return the range.
		return sprintf(
			// translators: %1$1s is the min price, %2$2s is the max price.
			__(
				'%1$1s - %2$2s',
				'surecart',
			),
			Currency::format( $this->metrics->min_price_amount, $this->metrics->currency ),
			Currency::format( $this->metrics->max_price_amount, $this->metrics->currency )
		);
	}

	/**
	 * Is the product on sale?
	 *
	 * @return array
	 */
	public function getIsOnSaleAttribute() {
		return $this->initial_price->is_on_sale ?? false;
	}

	/**
	 * Get the image used in line items.
	 *
	 * @return array
	 */
	public function getLineItemImageAttribute() {
		return is_a( $this->featured_image, GalleryItem::class ) ? $this->featured_image->attributes( 'thumbnail' ) : (object) array();
	}
}
