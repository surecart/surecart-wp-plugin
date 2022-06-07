<?php

namespace SureCart\Integrations\TutorLMS;

use SureCart\Integrations\Contracts\IntegrationInterface;
use SureCart\Integrations\Contracts\PurchaseSyncInterface;
use SureCart\Integrations\IntegrationService;
use SureCart\Models\Integration;
use SureCart\Models\Price;
use SureCart\Models\Product;

/**
 * Controls the LearnDash integration.
 */
class TutorLMSService extends IntegrationService implements IntegrationInterface, PurchaseSyncInterface {

	public function bootstrap() {
		parent::bootstrap();

		add_filter( 'tutor/course/single/entry-box/free', [ $this, 'purchaseButton' ], 10, 2 );
		add_filter( 'tutor/course/single/entry-box/purchasable', [ $this, 'purchaseButton' ], 10, 2 );
	}

	/**
	 * Show our purchase button if we have an integration.
	 */
	public function purchaseButton( $output, $id ) {
		$integrations = Integration::where( 'integration_id', $id )->andWhere( 'model_name', 'product' )->get();

		if ( empty( $integrations ) ) {
			return $output;
		}

		// if we have integrations.
		$product_ids = array_column( $integrations, 'model_id' );

		if ( empty( $product_ids ) ) {
			return $output;
		}

		// add our components.
		\SureCart::assets()->enqueueComponents();

		// get purchasable prices.
		$prices = Price::where(
			[
				'product_ids' => array_column( $integrations, 'model_id' ),
				'archived'    => false,
			]
		)->get();

		if ( empty( $prices ) ) {
			return $output;
		}

		include 'add-to-cart-surecart.php';
	}

	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return 'surecart/tutor-course';
	}

	/**
	 * Get the model for the integration.
	 *
	 * @return string
	 */
	public function getModel() {
		return 'product';
	}

	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return esc_url_raw( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/integrations/tutor.svg' );
	}

	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getLabel() {
		return __( 'TutorLMS Course', 'surecart' );
	}

	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getItemLabel() {
		return __( 'Course Access', 'surecart' );
	}

	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getItemHelp() {
		return __( 'Enable access to a TutorLMS course.', 'surecart' );
	}

	/**
	 * Is this enabled?
	 *
	 * @return boolean
	 */
	public function enabled() {
		return defined( 'TUTOR_VERSION' );
	}

	/**
	 * Get item listing for the integration.
	 *
	 * @param array  $items The integration items.
	 * @param string $search The search term.
	 *
	 * @return array The items for the integration.
	 */
	public function getItems( $items = [], $search = '' ) {
		if ( ! function_exists( 'tutor' ) ) {
			return $items;
		}

		wp_reset_query();
		$course_query = new \WP_Query(
			[
				'post_type'   => tutor()->course_post_type,
				'post_status' => 'publish',
				's'           => $search,
				'per_page'    => 10,
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
	 * Get the individual item.
	 *
	 * @param string $id Id for the record.
	 *
	 * @return object The item for the integration.
	 */
	public function getItem( $id ) {
		$course = get_post( $id );
		if ( ! $course ) {
			return [];
		}
		return (object) [
			'id'             => $id,
			'provider_label' => __( 'TutorLMS Course', 'surecart' ),
			'label'          => $course->post_title,
		];
	}

	/**
	 * Enable Access to the course.
	 *
	 * @param \SureCart\Models\Integration $integration The integrations.
	 * @param \WP_User                     $wp_user The user.
	 *
	 * @return boolean|void Returns true if the user course access updation was successful otherwise false.
	 */
	public function onPurchaseCreated( $integration, $wp_user ) {
		$this->updateAccess( $integration->integration_id, $wp_user, true );
	}

	/**
	 * Enable access when purchase is invoked
	 *
	 * @param \SureCart\Models\Integration $integration The integrations.
	 * @param \WP_User                     $wp_user The user.
	 *
	 * @return boolean|void Returns true if the user course access updation was successful otherwise false.
	 */
	public function onPurchaseInvoked( $integration, $wp_user ) {
		$this->onPurchaseCreated( $integration, $wp_user );
	}

	/**
	 * Remove a user role.
	 *
	 * @param \SureCart\Models\Integration $integration The integrations.
	 * @param \WP_User                     $wp_user The user.
	 *
	 * @return boolean|void Returns true if the user course access updation was successful otherwise false.
	 */
	public function onPurchaseRevoked( $integration, $wp_user ) {
		$this->updateAccess( $integration->integration_id, $wp_user, false );
	}

	/**
	 * Update access to a course.
	 *
	 * @param integer  $course_id The course id.
	 * @param \WP_User $wp_user The user.
	 * @param boolean  $add True to add the user to the course, false to remove.
	 *
	 * @return boolean|void Returns true if the user course access updation was successful otherwise false.
	 */
	public function updateAccess( $course_id, $wp_user, $add = true ) {
		// we don't have learndash installed.
		if ( ! function_exists( 'tutor_utils' ) ) {
			return;
		}

		if ( ! $add ) {
			tutor_utils()->cancel_course_enrol( $course_id, $wp_user->ID );
			return;
		}

		tutor_utils()->do_enroll( $course_id, 0, $wp_user->ID );
		tutor_utils()->complete_course_enroll( 0 );
		return;
	}
}
