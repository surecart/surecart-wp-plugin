<?php

namespace SureCart\Integrations;

use SureCart\Integrations\Contracts\IntegrationInterface;
use SureCart\Models\Integration;

/**
 * Base class for integrations to extend.
 */
abstract class IntegrationService implements IntegrationInterface {
	/**
	 * Get the slug for the integration.
	 *
	 * @return string
	 */
	public function getSlug() {
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
	public function getName() {
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
		add_filter( "surecart/integrations/providers/find/{$this->getSlug()}", [ $this, 'findProvider' ], 9 );

		// get items.
		add_filter( "surecart/integrations/providers/{$this->getSlug()}/{$this->getModel()}/items", [ $this, 'getItems' ], 9 );
		add_filter( "surecart/integrations/providers/{$this->getSlug()}/item", [ $this, 'getItem' ], 9, 2 );

		// purchase actions.
		if ( method_exists( $this, 'onPurchase' ) ) {
			add_action( 'surecart/purchase_created', [ $this, '_onPurchase' ], 9 );
			add_action( 'surecart/purchase_invoked', [ $this, '_onPurchase' ], 9 );
		}
		if ( method_exists( $this, 'onPurchaseCreated' ) ) {
			add_action( 'surecart/purchase_created', [ $this, '_onPurchaseCreated' ], 9 );
		}
		if ( method_exists( $this, 'onPurchaseInvoked' ) ) {
			add_action( 'surecart/purchase_invoked', [ $this, '_onPurchaseInvoked' ], 9 );
		}
		if ( method_exists( $this, 'onPurchaseRevoked' ) ) {
			add_action( 'surecart/purchase_revoked', [ $this, '_onPurchaseRevoked' ], 9 );
		}
	}


	/**
	 * Register routes for the provider.
	 *
	 * @return void
	 */
	public function registerRoutes() {
		// list all item choices for the provider.
		register_rest_route(
			"$this->name/v$this->version",
			"integration_provider_items/{$this->getSlug()}",
			[
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => [ $this, 'getItems' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
				],
				// Register our schema callback .
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		// get a specific item choice for the provider.
		register_rest_route(
			"$this->name/v$this->version",
			"integration_provider_items/{$this->getSlug()}/(?P<id>\S)",
			[
				[
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => [ $this, 'getItem' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
				],
				// Register our schema callback .
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
	}

	/**
	 * List items permissions check.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function getItemsPermissionsCheck( $request ) {
		return current_user_can( 'edit', "sc_{$this->getModel()}s" );
	}

	/**
	 * Get item permissions check.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return true|\WP_Error True if the request has access to create items, WP_Error object otherwise.
	 */
	public function getItemPermissionsCheck( $request ) {
		return current_user_can( 'edit', "sc_{$this->getModel()}s" );
	}

	/**
	 * When a purchase is invoked or created.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 */
	public function _onPurchase( $purchase ) {
		[ $integrations, $wp_user ] = $this->getIntegrationData( $purchase );
		if ( method_exists( $this, 'onPurchase' ) ) {
			foreach ( $integrations as $integration ) {
				if ( ! $integration->id ) {
					continue;
				}
				call_user_func_array( [ $this, 'onPurchase' ], [ $integration, $wp_user ] );
			}
		}
	}

	/**
	 * When a purchase is created.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 */
	public function _onPurchaseCreated( $purchase ) {
		[ $integrations, $wp_user ] = $this->getIntegrationData( $purchase );
		if ( method_exists( $this, 'onPurchaseCreated' ) ) {
			foreach ( $integrations as $integration ) {
				if ( ! $integration->id ) {
					continue;
				}
				call_user_func_array( [ $this, 'onPurchaseCreated' ], [ $integration, $wp_user ] );
			}
		}
	}

	/**
	 * When a purchase is invoked.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 */
	public function _onPurchaseInvoked( $purchase ) {
		[ $integrations, $wp_user ] = $this->getIntegrationData( $purchase );
		if ( method_exists( $this, 'onPurchaseInvoked' ) ) {
			foreach ( $integrations as $integration ) {
				if ( ! $integration->id ) {
					continue;
				}
				call_user_func_array( [ $this, 'onPurchaseInvoked' ], [ $integration, $wp_user ] );
			}
		}
	}

	/**
	 * When a purchase is revoked.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 */
	public function _onPurchaseRevoked( $purchase ) {
		[ $integrations, $wp_user ] = $this->getIntegrationData( $purchase );
		if ( method_exists( $this, 'onPurchaseRevoked' ) ) {
			foreach ( $integrations as $integration ) {
				if ( ! $integration->id ) {
					continue;
				}
				call_user_func_array( [ $this, 'onPurchaseRevoked' ], [ $integration, $wp_user ] );
			}
		}
	}

	/**
	 * Get the Integration data from the purchase.
	 * This normalizes the integration data and the WP user.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 *
	 * @return array The integration data.
	 */
	protected function getIntegrationData( $purchase ) {
		// need a user.
		$user = $purchase->getUser();
		if ( empty( $user->ID ) ) {
			return;
		}

		// get the raw WP User.
		$wp_user = $user->getWPUser();
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
			'slug'       => $this->getSlug(),
			'name'       => $this->getName(),
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

		return (array) Integration::where( 'model_id', $product_id )->andWhere( 'provider', $this->getSlug() )->get();
	}
}
