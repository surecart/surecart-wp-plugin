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
	public function publish( $id = null ) {
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

		return $this;
	}

	/**
	 * Unpublish the review.
	 *
	 * @param string $id Review ID.
	 *
	 * @return $this|\WP_Error
	 */
	public function unpublish( $id = null ) {
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

		return $this;
	}


	/**
	 * Get all review statuses.
	 *
	 * @return array
	 */
	public function getStatuses(): array {
		return [
			'in_review'   => __( 'In Review', 'surecart' ),
			'published'   => __( 'Approved', 'surecart' ),
			'unpublished' => __( 'Rejected', 'surecart' ),
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
