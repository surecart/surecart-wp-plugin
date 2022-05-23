<?php

namespace SureCart\Integrations;

use SureCart\Integrations\Contracts\IntegrationInterface;
use SureCart\Integrations\Contracts\PurchaseSyncInterface;
use SureCart\Models\Integration;
use SureCart\Models\Purchase;

/**
 * Base class for integrations to extend.
 */
abstract class IntegrationService extends AbstractIntegration implements IntegrationInterface {
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
	 * Enable by default.
	 *
	 * @return boolean
	 */
	public function enabled() {
		return true;
	}

	/**
	 * Map this class methods to specific events.
	 *
	 * @var array
	 */
	protected $methods_map = [
		'surecart/purchase_created' => 'onPurchaseCreated',
		'surecart/purchase_invoked' => 'onPurchaseInvoked',
		'surecart/purchase_revoked' => 'onPurchaseRevoked',
	];

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
			add_action( 'surecart/purchase_updated', [ $this, 'onPurchaseUpdated' ], 9, 2 );
		}
	}

	/**
	 * The purchase has been updated.
	 * This is extendable, but is also abtracted into
	 * invoke/revoke and quantity update methods.
	 *
	 * @param Purchase $purchase The purchase.
	 * @param array    $request The request.
	 *
	 * @return void
	 */
	public function onPurchaseUpdated( $purchase, $request ) {
		$data     = $request['data']['object'] ?? null;
		$previous = $request['data']['previous_attributes'] ?? null;

		// we need data or a previous.
		if ( empty( $data ) || empty( $previous ) ) {
			return;
		}

		// product has changed, let's revoke access to the old one
		// and provide access to the new one.
		if ( ! empty( $previous['product'] ) && $data['product'] !== $previous['product'] ) {
			$previous_purchase             = $purchase;
			$previous_purchase['product']  = $previous['product'];
			$previous_purchase['quantity'] = $previous['quantity'] ?? 1;
			$this->onPurchaseProductUpdated( $purchase, $previous_purchase, $request );
			return;
		}

		// The quantity has not changed.
		if ( (int) $data['quantity'] === (int) $previous['quantity'] ) {
			return;
		}

		// run quantity updated method.
		$integrations = (array) $this->getIntegrationData( $purchase ) ?? [];
		foreach ( $integrations as $integration ) {
			if ( ! $integration->id ) {
				continue;
			}
			$this->onPurchaseQuantityUpdated( $data['quantity'], $previous['quantity'], $integration, $purchase->getWPUser() );
		}
	}

	/**
	 * When the purchase product is updated
	 *
	 * @param \SureCart\Models\Purchase $purchase The purchase.
	 * @param \SureCart\Models\Purchase $previous_purchase The previous purchase.
	 * @param array                     $request The request.
	 *
	 * @return void
	 */
	public function onPurchaseProductUpdated( $purchase, $previous_purchase, $request ) {
		// product added.
		$integrations = (array) $this->getIntegrationData( $purchase ) ?? [];
		foreach ( $integrations as $integration ) {
			if ( ! $integration->id ) {
				continue;
			}
			$this->onPurchaseProductAdded( $integration, $purchase->getWPUser() );
		}

		// product removed.
		$integrations = (array) $this->getIntegrationData( $previous_purchase ) ?? [];
		foreach ( $integrations as $integration ) {
			if ( ! $integration->id ) {
				continue;
			}
			$this->onPurchaseProductRemoved( $integration, $purchase->getWPUser() );
		}
	}

	/**
	 * Method to run when the quantity updates.
	 *
	 * @param integer  $quantity The new quantity.
	 * @param integer  $previous The previous quantity.
	 * @param Purchase $purchase The purchase.
	 * @param array    $request The request.
	 *
	 * @return void
	 */
	public function onPurchaseQuantityUpdated( $quantity, $previous, $purchase, $request ) {
		// Allow this to be extended to provide functionality. Do nothing by default.
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
		$method = $this->methods_map[ $this->getCurrentAction() ] ?? null;
		if ( ! $method || ! method_exists( $this, $method ) ) {
			return;
		}

		$integrations = (array) $this->getIntegrationData( $purchase ) ?? [];
		foreach ( $integrations as $integration ) {
			if ( ! $integration->id ) {
				continue;
			}
			$this->$method( $integration, $purchase->getWPUser() );
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
	 * Undocumented function
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 *
	 * @return void
	 */
	public function getWPUser( $purchase ) {
		if ( is_string( $purchase ) ) {
			$purchase = Purchase::find( $purchase );
		}
		if ( is_wp_error( $purchase ) ) {
			return;
		}
		return $purchase->getWPUser();
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

		// Get the integrations from the purchase.
		return $this->getIntegrationsFromPurchase( $purchase );
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
			'disabled'   => ! $this->enabled(),
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
