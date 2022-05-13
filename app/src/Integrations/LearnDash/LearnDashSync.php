<?php

namespace SureCart\Integrations\LearnDash;

use SureCart\Integrations\PurchaseSyncInterface;

/**
 * Controls the LearnDash integration.
 */
class LearnDashSync implements PurchaseSyncInterface {
	/**
	 * Bootstrap actions.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'surecart/purchase_created', [ $this, 'enableAccess' ], 10 );
		add_action( 'surecart/purchase_invoked', [ $this, 'enableAccess' ], 10 );
		add_action( 'surecart/purchase_revoked', [ $this, 'revokeAccess' ], 10 );
	}

	/**
	 * Add to provider list.
	 *
	 * @param array  $list List of providers.
	 * @param string $model The surecart model.
	 *
	 * @return array
	 */
	public function addToProviderList( $list, $model ) {
		if ( 'purchase' !== $model ) {
			$list[] = [
				'slug' => 'learndash',
				'name' => 'LearnDash',

			];
		}
		return $list;
	}

	/**
	 * Get the specific course id
	 *
	 * @param string $product_id The product id.
	 *
	 * @return string|null The course id or null if not found.
	 */
	public function getItemId( $product_id ) {
		return get_option( 'surecart_learndash_course_sync' . $product_id );
	}

	/**
	 * Enable Access to the course.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 * @return boolean|void Returns true if the user course access updation was successful otherwise false.
	 */
	public function enableAccess( $purchase ) {
		$this->updateAccess( $purchase, true );
	}

	/**
	 * Revoke Access to the course.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 * @return boolean|void Returns true if the user course access updation was successful otherwise false.
	 */
	public function revokeAccess( $purchase ) {
		return $this->updateAccess( $purchase, false );
	}

	/**
	 * Update access to a course.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 * @param boolean                   $add True to add access, false to revoke access.
	 *
	 * @return boolean|void Returns true if the user course access updation was successful otherwise false.
	 */
	public function updateAccess( $purchase, $add = true ) {
		if ( ! function_exists( 'ld_update_course_access' ) ) {
			return;
		}

		// we need a product id.
		$product_id = $purchase->product_id ?? null;
		if ( ! $product_id ) {
			return;
		}

		// we need a course to sync.
		$course_id = $this->getItemId( $product_id );
		if ( ! $course_id ) {
			return;
		}

		$user = $purchase->getUser();
		return \ld_update_course_access( $user->id, $course_id, $add );
	}
}
