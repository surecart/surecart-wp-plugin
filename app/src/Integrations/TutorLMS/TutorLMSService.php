<?php

namespace SureCart\Integrations\TutorLMS;

use SureCart\Integrations\Contracts\IntegrationInterface;
use SureCart\Integrations\Contracts\PurchaseSyncInterface;
use SureCart\Integrations\IntegrationService;
use SureCart\Models\Integration;
use SureCart\Models\Product;

/**
 * Controls the LearnDash integration.
 */
class TutorLMSService extends IntegrationService implements IntegrationInterface, PurchaseSyncInterface {

	public function bootstrap() {
		parent::bootstrap();

		add_action( 'surecart/integrations/create', [ $this, 'maybeStoreProductId' ] );
		/**
		 * Is Course Purchasable
		 */
		// add_filter( 'is_course_purchasable', array( $this, 'is_course_purchasable' ), 10, 2 );
		// add_filter( 'get_tutor_course_price', array( $this, 'get_tutor_course_price' ), 10, 2 );
		// add_filter( 'tutor_course_sell_by', array( $this, 'tutor_course_sell_by' ) );
		// add_filter( 'tutor_get_template_path', [ $this, 'templatePath' ] );
		add_filter( 'tutor/course/single/entry-box/free', [ $this, 'purchaseButton' ], 10, 2 );
	}

	/**
	 * If we have integrations, use them
	 */
	public function purchaseButton( $output, $id ) {
		$integrations = Integration::where( 'integration_id', $id )->get();

		// if we have integrations.
		if ( ! empty( $integrations ) ) {
			\SureCart::assets()->enqueueComponents();
			// get the product ids.
			$product_ids = array_column( $integrations, 'model_id' );
			$products    = Product::where( [ 'ids' => $product_ids ] )->with( [ 'prices' ] )->get();
			if ( ! empty( $products ) ) {
				include 'add-to-cart-surecart.php';
				return;
			}
		}
		return $output;
	}

	public function is_course_purchasable( $bool, $course_id ) {
		return true;
		// $course_id = tutor_utils()->get_post_id($course_id);
		// $has_product_id = get_post_meta($course_id, '_tutor_course_product_id', true);
		// if ($has_product_id) {
		// return true;
		// }
		// return false;
	}

	public function get_tutor_course_price( $price, $course_id ) {
		return '123';
	}

	public function tutor_course_sell_by() {
		return 'surecart';
	}

	public function templatePath( $path ) {
		if ( false !== strpos( $path, 'add-to-cart-surecart' ) ) {
			return dirname( __FILE__ ) . '/add-to-cart-surecart.php';
		}
		return $path;
	}

	/**
	 * Maybe store the TutorLMS product id when the integration is saved.
	 */
	public function maybeStoreProductId( $args ) {
		if ( empty( $args['provider'] ) || empty( $args['integration_id'] ) || empty( $args['model_id'] ) ) {
			return;
		}
		$integrations = Integration::where( 'integration_id', $args['integration_id'] )->first();

		if ( 'surecart/tutor-course' === $args['provider'] ) {
			update_post_meta( (int) $args['integration_id'], '_tutor_course_product_id', $args['model_id'] );
		}

	}

	/**
	 * Add SureCart to monitization options.
	 *
	 * @param array $arr array of monitization options.
	 *
	 * @return array
	 */
	public function addMonitizationOption( $arr ) {
		$arr['surecart'] = __( 'SureCart', 'surecart' );
		return $arr;
	}

	public function showTutorPrice( $price, $course_id ) {
		$product_id = tutor_utils()->get_course_product_id( $course_id );

		return 'surecart price';
	}

	/**
	 * TODO: Need to save tutorLMS product id when surecart product is created.
	 */
	public function saveCourseMeta( $post_ID ) {
		$product_id = tutor_utils()->avalue_dot( '_tutor_course_product_id', tutor_sanitize_data( $_POST ) );

		if ( $product_id !== '-1' ) {
			$product_id = (int) $product_id;
			if ( $product_id ) {
				update_post_meta( $post_ID, '_tutor_course_product_id', $product_id );
				update_post_meta( $product_id, '_tutor_product', 'yes' );
			}
		} else {
			delete_post_meta( $post_ID, '_tutor_course_product_id' );
		}
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

		// $order = Purchase::with( [ 'order', 'invoice' ] )->find()

		$has_any_enrolled = tutor_utils()->has_any_enrolled( $course_id, $wp_user->ID );
		if ( ! $has_any_enrolled ) {
			tutor_utils()->do_enroll( $course_id, $payment_id, $wp_user->ID );
		}

		tutor_utils()->complete_course_enroll( $payment_id );
	}
}
