<?php

namespace SureCart\Integrations\User;

use SureCart\Integrations\Contracts\IntegrationInterface;
use SureCart\Integrations\Contracts\PurchaseSyncInterface;
use SureCart\Integrations\IntegrationService;

/**
 * Controls the LearnDash integration.
 */
class UserService extends IntegrationService implements IntegrationInterface, PurchaseSyncInterface {
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
		// phpcs:ignore
		return 'wordpress';
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
			$sub['id']      = esc_attr( $role );
			$sub['label']   = translate_user_role( $details['name'] );
			$roles[ $role ] = $sub;
		}
		return $roles;
	}

	/**
	 * Get the individual item.
	 *
	 * @param string $role The item role.
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
	 * Add the role when the purchase is created.
	 *
	 * @param \SureCart\Models\Integration $integration The integrations.
	 * @param \WP_User                     $wp_user The user.
	 *
	 * @return boolean|void Returns true if the user course access updation was successful otherwise false.
	 */
	public function onPurchaseCreated( $integration, $wp_user ) {
		$this->toggleRole( $integration->integration_id, $wp_user, true );
	}

	/**
	 * Add the role when the purchase is invoked
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
	 * Remove a user role when the purchase is revoked.
	 *
	 * @param \SureCart\Models\Integration $integration The integrations.
	 * @param \WP_User                     $wp_user The user.
	 *
	 * @return boolean|void Returns true if the user course access updation was successful otherwise false.
	 */
	public function onPurchaseRevoked( $integration, $wp_user ) {
		$this->toggleRole( $integration->integration_id, $wp_user, false );
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
	public function toggleRole( $role, $wp_user, $add = true ) {
		// make sure the role exists.
		$role_object = get_role( $role );
		if ( ! $role_object ) {
			return;
		}
		// add or remove the role.
		return $add ? $wp_user->add_role( $role ) : $wp_user->remove_role( $role );
	}
}
