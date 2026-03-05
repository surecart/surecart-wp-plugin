<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasProduct;
use SureCart\Models\Traits\HasPurchase;
use SureCart\Models\Traits\HasDates;

/**
 * Review model
 */
class Review extends Model {
	use HasCustomer;
	use HasProduct;
	use HasPurchase;
	use HasDates;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'reviews';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'review';

	/**
	 * Is this cachable?
	 *
	 * @var boolean
	 */
	protected $cachable = true;

	/**
	 * Clear cache when reviews are updated.
	 *
	 * @var string
	 */
	protected $cache_key = 'reviews';

	/**
	 * Publish the review.
	 *
	 * @param string $id Review ID.
	 *
	 * @return $this|\WP_Error
	 */
	protected function publish( $id = null ) {
		if ( $id ) {
			$this->setAttribute( 'id', $id );
		}

		if ( $this->fireModelEvent( 'publishing' ) === false ) {
			return $this;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'No review provided.' );
		}

		$published = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/publish',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
			]
		);

		if ( is_wp_error( $published ) ) {
			return $published;
		}

		$this->resetAttributes();
		$this->fill( $published );
		$this->fireModelEvent( 'published' );

		\SureCart::account()->clearCache();

		// Sync the associated product to update cached review statistics.
		$this->syncProduct();

		return $this;
	}

	/**
	 * Unpublish the review.
	 *
	 * @param string $id Review ID.
	 *
	 * @return $this|\WP_Error
	 */
	protected function unpublish( $id = null ) {
		if ( $id ) {
			$this->setAttribute( 'id', $id );
		}

		if ( $this->fireModelEvent( 'unpublishing' ) === false ) {
			return $this;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'No review provided.' );
		}

		$unpublished = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/unpublish',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
			]
		);

		if ( is_wp_error( $unpublished ) ) {
			return $unpublished;
		}

		$this->resetAttributes();
		$this->fill( $unpublished );
		$this->fireModelEvent( 'unpublished' );

		\SureCart::account()->clearCache();

		// Sync the associated product to update cached review statistics.
		$this->syncProduct();

		return $this;
	}

	/**
	 * Delete the review.
	 *
	 * @param string $id The id of the review to delete.
	 *
	 * @return $this|false
	 */
	protected function delete( $id = '' ) {
		// Store the product_id before deletion since we need it after the model is deleted.
		$product_id = $this->product_id;

		// Call parent delete.
		$result = parent::delete( $id );

		// Clear cache after deletion.
		\SureCart::account()->clearCache();

		// If deletion was successful, sync the product.
		if ( ! is_wp_error( $result ) && $product_id ) {
			$this->syncProduct( $product_id );
		}

		return $result;
	}

	/**
	 * Sync a product to refresh cached review statistics.
	 *
	 * @param string|null $product_id The product ID. If null, uses $this->product_id.
	 *
	 * @return void
	 */
	protected function syncProduct( $product_id = null ) {
		$product_id = $product_id ?? $this->product_id;
		if ( empty( $product_id ) ) {
			return;
		}

		// Queue a background sync to update the WordPress post meta with fresh product data.
		// This avoids blocking the current request with an API call.
		\SureCart::queue()->async(
			'surecart/sync/product',
			[
				'id'          => $product_id,
				'show_notice' => false,
			]
		);

		// Trigger the queue to process immediately.
		\SureCart::queue()->run();
	}

	/**
	 * Get all review statuses.
	 *
	 * @return array
	 */
	public function getStatuses(): array {
		return [
			'in_review'   => esc_html__( 'In Review', 'surecart' ),
			'published'   => esc_html__( 'Approved', 'surecart' ),
			'unpublished' => esc_html__( 'Rejected', 'surecart' ),
		];
	}

	/**
	 * Get the status type for tag styling.
	 *
	 * @return string
	 */
	public function getStatusTypeAttribute(): string {
		$types = [
			'in_review'   => 'warning',
			'published'   => 'success',
			'unpublished' => 'danger',
		];
		return $types[ $this->status ] ?? 'default';
	}

	/**
	 * Get the status display label.
	 *
	 * @return string
	 */
	public function getStatusDisplayAttribute(): string {
		return $this->getStatuses()[ $this->status ] ?? $this->status ?? '';
	}
}
