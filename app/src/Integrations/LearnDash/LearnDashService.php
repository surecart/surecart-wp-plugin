<?php

namespace SureCart\Integrations\LearnDash;

use SureCart\Models\Integration;
use SureCart\Models\Product;

/**
 * Controls the LearnDash integration.
 */
class LearnDashService {
	/**
	 * Integration slug.
	 *
	 * @var string
	 */
	protected $slug = 'learndash-course';

	/**
	 * The model to show the integration provider.
	 *
	 * @var string
	 */
	protected $model = 'product';

	/**
	 * Bootstrap actions.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_filter( "surecart/integrations/providers/list/{$this->model}", [ $this, 'addToProviderList' ], 9 );
		add_filter( "surecart/integrations/providers/{$this->slug}/{$this->model}/items", [ $this, 'getItems' ], 9 );
		add_filter( "surecart/integrations/providers/{$this->slug}/item", [ $this, 'getItem' ], 9, 2 );

		add_action( 'surecart/purchase_created', [ $this, 'enableAccess' ], 10 );
		add_action( 'surecart/purchase_invoked', [ $this, 'enableAccess' ], 10 );
		add_action( 'surecart/purchase_revoked', [ $this, 'revokeAccess' ], 10 );

		// when a purchase is set, update course access.
		add_action( 'surecart/purchase/attributes_set', [ $this, 'checkPurchaseAccess' ], 10, 2 );
	}

	/**
	 * Add to provider list.
	 *
	 * @param array $list List of providers for the model.
	 *
	 * @return array
	 */
	public function addToProviderList( $list ) {
		$list[] = [
			'slug' => $this->slug,
			'name' => __( 'LearnDash Course', 'surecart' ),
		];
		return $list;
	}

	/**
	 * Get the specific course id
	 *
	 * @param array $items The integration items.
	 *
	 * @return array The items for the integration.
	 */
	public function getItems( $items ) {
		$course_query = new \WP_Query(
			[
				'post_type' => 'sfwd-courses',
				'nopaging'  => true,
			]
		);

		if ( ( isset( $course_query->posts ) ) && ( ! empty( $course_query->posts ) ) ) {
			$items = array_map(
				function( $post ) {
					return (object) [
						'id'    => $post->ID,
						'label' => $post->post_title,
					];
				},
				$course_query->posts
			);
		}

		return $items;
	}

	/**
	 * Get the item.
	 *
	 * @param object $item The item.
	 * @param string $id Id for the record.
	 *
	 * @return array
	 */
	public function getItem( $item, $id ) {
		$course = get_post( $id );
		$item   = [
			'id'             => $id,
			'provider_label' => __( 'LearnDash Course', 'surecart' ),
			'label'          => $course->post_title,
		];
		return $item;
	}


	/**
	 * Enable Access to the course.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 * @return boolean|void Returns true if the user course access updation was successful otherwise false.
	 */
	public function enableAccess( $purchase ) {
		$this->updateAccess( $purchase, false );
	}

	/**
	 * Revoke Access to the course.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 * @return boolean|void Returns true if the user course access updation was successful otherwise false.
	 */
	public function revokeAccess( $purchase ) {
		return $this->updateAccess( $purchase, true );
	}

	/**
	 * Update access to a course.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 * @param boolean                   $remove True to remove access, false to add access.
	 *
	 * @return boolean|void Returns true if the user course access updation was successful otherwise false.
	 */
	public function updateAccess( $purchase, $remove = false ) {
		// we don't have learndash installed.
		if ( ! function_exists( 'ld_update_course_access' ) ) {
			return;
		}

		// we need a product id.
		$product_id = $purchase->product_id ?? null;
		if ( ! $product_id ) {
			return;
		}

		// we need a course(s) to sync.
		$integrations = Integration::where( 'model_id', $product_id )->andWhere( 'provider', 'learndash-course' )->get();
		if ( empty( $integrations ) ) {
			return;
		}

		// loop through each course and update the access.
		foreach ( $integrations as $integration ) {
			// need an integration id.
			if ( empty( $integration->integration_id ) ) {
				return;
			}

			// need a user.
			$user = $purchase->getUser();
			if ( empty( $user->ID ) ) {
				return;
			}

			// update course access.
			\ld_update_course_access( $user->ID, $integration->integration_id, $remove );
		}
	}

	/**
	 * Check the purchase access when the purchase model is loaded.
	 * We do this in case a webhook is not caught, we can get it directly.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 *
	 * @return void
	 */
	public function checkPurchaseAccess( $purchase ) {
		// this is not purchased.
		if ( ! $purchase->id ) {
			return;
		}
		return $purchase->revoked ? $this->revokeAccess( $purchase ) : $this->enableAccess( $purchase );
	}
}
