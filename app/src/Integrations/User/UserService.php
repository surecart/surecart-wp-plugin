<?php

namespace SureCart\Integrations\User;

use SureCart\Integrations\Contracts\IntegrationInterface;
use SureCart\Integrations\IntegrationService;

/**
 * Controls the LearnDash integration.
 */
class UserService extends IntegrationService implements IntegrationInterface {
	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getSlug() {
		return 'user';
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
		return __( 'Change WordPress User Role', 'surecart' );
	}

	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getItemLabel() {
		return __( 'Change User Role', 'surecart' );
	}

	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getItemHelp() {
		return __( 'Change the user role of the user who purchased the product.', 'surecart' );
	}

	/**
	 * Get item listing for the integration.
	 *
	 * @param array $items The integration items.
	 *
	 * @return array The items for the integration.
	 */
	public function getItems( $items = [] ) {
		$roles          = [];
		$editable_roles = get_editable_roles();
		foreach ( $editable_roles as $role => $details ) {
			$sub['id']    = esc_attr( $role );
			$sub['label'] = translate_user_role( $details['name'] );
			$roles[]      = $sub;
		}
		return $roles;
	}

	/**
	 * Get the individual item.
	 *
	 * @param string $item The item record.
	 * @param string $id Id for the record.
	 *
	 * @return array The item for the integration.
	 */
	public function getItem( $role ) {
		return [
			'id'    => $role,
			'label' => wp_roles()->get_names()[ $role ],
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
	public function onPurchase( $integration, $wp_user ) {
		$this->toggleRole( $wp_user, $integration->integration_id, true );
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
		$this->toggleRole( $wp_user, $integration->integration_id, false );
	}

	/**
	 * Toggle the role
	 *
	 * @param \WP_User $wp_user  The user object.
	 * @param string   $role The role.
	 * @param boolean  $add  True to add the role, false to remove.
	 *
	 * @return \WP_Role|false
	 */
	public function toggleRole( $wp_user, $role, $add = true ) {
		// make sure the role exists.
		$role_object = get_role( $role );
		if ( ! $role_object ) {
			return;
		}
		// add or remove the role.
		return $add ? $wp_user->add_role( $role ) : $wp_user->remove_role( $role );
	}
}
