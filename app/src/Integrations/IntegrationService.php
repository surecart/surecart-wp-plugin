<?php

namespace SureCart\Integrations;

use SureCart\Integrations\Contracts\IntegrationInterface;
use SureCart\Integrations\Contracts\PurchaseSyncInterface;
use SureCart\Models\Integration;
use SureCart\Models\Purchase;

/**
 * Base class for integrations to extend.
 */
abstract class IntegrationService implements IntegrationInterface {
	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getName() {
		return '';
	}

	/**
	 * Get the model for the integration.
	 *
	 * @return string
	 */
	public function getModel() {
		return '';
	}


	/**
	 * Get the logo for the integration.
	 *
	 * @return string
	 */
	public function getLogo() {
		return '';
	}

	/**
	 * Get the name for the integration.
	 *
	 * @return string
	 */
	public function getLabel() {
		return '';
	}

	/**
	 * Get the item label for the integration.
	 *
	 * @return string
	 */
	public function getItemLabel() {
		return '';
	}

	/**
	 * Get the item help label for the integration.
	 *
	 * @return string
	 */
	public function getItemHelp() {
		return '';
	}

	/**
	 * Get item listing for the integration.
	 *
	 * @param array $items The integration items.
	 *
	 * @return array The items for the integration.
	 */
	public function getItems( $items = [] ) {
		return $items;
	}

	/**
	 * Get the individual item.
	 *
	 * @param string $id Id for the record.
	 *
	 * @return array The item for the integration.
	 */
	public function getItem( $id ) {
		return [];
	}

	/**
	 * Bootstrap the integration.
	 */
	public function bootstrap() {
		// index and list.
		add_filter( "surecart/integrations/providers/list/{$this->getModel()}", [ $this, 'indexProviders' ], 9 );
		add_filter( "surecart/integrations/providers/find/{$this->getName()}", [ $this, 'findProvider' ], 9 );

		// get items.
		add_filter( "surecart/integrations/providers/{$this->getName()}/{$this->getModel()}/items", [ $this, 'getItems' ], 9 );
		add_filter( "surecart/integrations/providers/{$this->getName()}/item", [ $this, '_getItem' ], 9, 2 );

		// implement purchase events if purchase sync interface is implemented.
		if ( is_subclass_of( $this, PurchaseSyncInterface::class ) ) {
			add_action( 'surecart/purchase_created', [ $this, 'callMethod' ], 9 );
			add_action( 'surecart/purchase_invoked', [ $this, 'callMethod' ], 9 );
			add_action( 'surecart/purchase_revoked', [ $this, 'callMethod' ], 9 );
		}
	}

	/**
	 * Get the method we will call for the action.
	 *
	 * @param string $action The action name.
	 * @return string
	 */
	public function getActionMethod( $action ) {
		switch ( $action ) {
			case 'surecart/purchase_created':
				return 'onPurchaseCreated';
			case 'surecart/purchase_invoked':
				return 'onPurchaseInvoked';
			case 'surecart/purchase_revoked':
				return 'onPurchaseRevoked';
		}
		return null;
	}

	/**
	 * Get the item.
	 *
	 * @param string $id Id for the record.
	 *
	 * @return object
	 */
	public function _getItem( $id ) {
		$item       = (object) $this->getItem( $id );
		$item->logo = esc_url_raw( $this->getLogo() );
		return $item;
	}

	/**
	 * Call the method for the integration.
	 *
	 * @param \SureCart\Models\Purchase $purchase The purchase model.
	 *
	 * @return void
	 */
	public function callMethod( $purchase ) {
		$method = $this->getActionMethod( $this->getCurrentAction() );
		if ( ! $method ) {
			return;
		}

		[ $integrations, $wp_user ] = $this->getIntegrationData( $purchase );
		if ( ! method_exists( $this, $method ) || empty( $integrations ) ) {
			return;
		}

		foreach ( $integrations as $integration ) {
			if ( ! $integration->id ) {
				continue;
			}
			call_user_func_array( [ $this, $method ], [ $integration, $wp_user ] );
		}
	}

	/**
	 * Get the current called action.
	 *
	 * @return string
	 */
	protected function getCurrentAction() {
		return \current_action();
	}

	/**
	 * Get the Integration data from the purchase.
	 * This normalizes the integration data and the WP user.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 *
	 * @return array The integration data.
	 */
	public function getIntegrationData( $purchase ) {
		if ( is_string( $purchase ) ) {
			$purchase = Purchase::find( $purchase );
		}
		if ( is_wp_error( $purchase ) ) {
			return;
		}

		// need a user.
		$user = $purchase->getUser() ?? null;
		if ( empty( $user->ID ) ) {
			return;
		}

		// get the raw WP User.
		$wp_user = $user->getWPUser() ?? null;
		if ( ! $wp_user ) {
			return;
		}

		// Get the integrations from the purchase.
		$integrations = $this->getIntegrationsFromPurchase( $purchase );
		if ( empty( $integrations ) ) {
			return;
		}

		return [ $integrations, $wp_user ];
	}

	/**
	 * Add the provider to the list.
	 *
	 * @param array $list The list of providers.
	 * @return array
	 */
	public function indexProviders( $list = [] ) {
		$list[] = $this->findProvider();
		return $list;
	}

	/**
	 * Find the provider.
	 *
	 * @return array
	 */
	public function findProvider() {
		return [
			'name'       => $this->getName(),
			'label'      => $this->getLabel(),
			'logo'       => esc_url_raw( $this->getLogo() ),
			'item_label' => $this->getItemLabel(),
			'item_help'  => $this->getItemHelp(),
		];
	}

	/**
	 * Get the integration based on the current purchase.
	 *
	 * @param \SureCart\Models\Purchase $purchase The purchase.
	 *
	 * @return array
	 */
	public function getIntegrationsFromPurchase( $purchase ) {
		// we need a product id.
		$product_id = $purchase->product_id ?? null;
		if ( ! $product_id ) {
			return [];
		}
		return (array) Integration::where( 'model_id', $product_id )->andWhere( 'provider', $this->getName() )->get();
	}
}
