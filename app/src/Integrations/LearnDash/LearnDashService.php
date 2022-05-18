<?php

namespace SureCart\Integrations\LearnDash;

use SureCart\Integrations\Contracts\IntegrationInterface;
use SureCart\Integrations\Contracts\PurchaseSyncInterface;
use SureCart\Integrations\IntegrationService;

/**
 * Controls the LearnDash integration.
 */
class LearnDashService extends IntegrationService implements IntegrationInterface, PurchaseSyncInterface {
	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getSlug() {
		return 'learndash-course';
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
		return 'learndash';
	}

	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return __( 'LearnDash Course', 'surecart' );
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
		return __( 'Enable access to a LearnDash course.', 'surecart' );
	}

	/**
	 * Get item listing for the integration.
	 *
	 * @param array $items The integration items.
	 *
	 * @return array The items for the integration.
	 */
	public function getItems( $items = [] ) {
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
			'provider_label' => __( 'LearnDash Course', 'surecart' ),
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
		if ( ! function_exists( 'ld_update_course_access' ) ) {
			return;
		}
		// update course access.
		return \ld_update_course_access( $wp_user->ID, $course_id, ! $add );
	}
}
