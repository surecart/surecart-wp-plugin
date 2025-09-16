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
			return new \WP_Error( 'not_saved', 'Please create the review.' );
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
			return new \WP_Error( 'not_saved', 'Please create the review.' );
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

		return $this;
	}

	/**
	 * Get the customer name.
	 *
	 * @return string
	 */
	public function getCustomerNameAttribute() {
		return $this->customer->name ?? '';
	}

	/**
	 * Get the customer email.
	 *
	 * @return string
	 */
	public function getCustomerEmailAttribute() {
		return $this->customer->email ?? '';
	}

	/**
	 * Get the customer avatar URL.
	 *
	 * @return string
	 */
	public function getCustomerAvatarUrlAttribute() {
		$email = $this->customer->email ?? '';
		return $email ? get_avatar_url( $email ) : '';
	}

	/**
	 * Get the product name.
	 *
	 * @return string
	 */
	public function getProductNameAttribute() {
		return $this->product->name ?? '';
	}

	/**
	 * Get the status display label.
	 *
	 * @return string
	 */
	public function getStatusDisplayAttribute() {
		$statuses = [
			'in_review'   => __( 'In Review', 'surecart' ),
			'published'   => __( 'Approved', 'surecart' ),
			'unpublished' => __( 'Unapproved', 'surecart' ),
			'archived'    => __( 'Archived', 'surecart' ),
		];

		return $statuses[ $this->status ] ?? $this->status;
	}

	/**
	 * Get the status display text.
	 *
	 * @return string
	 */
	public function getStatusDisplayTextAttribute() {
		return $this->status_display;
	}

	/**
	 * Get the status type for tag styling.
	 *
	 * @return string
	 */
	public function getStatusTypeAttribute() {
		$types = [
			'published'   => 'success',
			'in_review'   => 'warning',
			'unpublished' => 'danger',
			'archived'    => 'default',
		];
		return $types[ $this->status ] ?? 'default';
	}
}
