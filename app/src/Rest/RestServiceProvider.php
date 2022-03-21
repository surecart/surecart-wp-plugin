<?php

namespace CheckoutEngine\Rest;

use CheckoutEngine\Models\Model;
use CheckoutEngine\Rest\RestServiceInterface;
use CheckoutEngine\Controllers\Rest\OrderController;

/**
 * Abstract Rest Service Provider interface
 */
abstract class RestServiceProvider extends \WP_REST_Controller implements RestServiceInterface {
	/**
	 * Mark specific properties that need additional permissions checks
	 * before modifying. We don't want customers being able to modify these.
	 *
	 * @var array
	 */
	protected $property_permissions = [];

	/**
	 * Plugin namespace.
	 *
	 * @var string
	 */
	protected $name = 'surecart';

	/**
	 * API Version
	 *
	 * @var string
	 */
	protected $version = '1';

	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = '';

	/**
	 * Controller class
	 *
	 * @var string
	 */
	protected $controller = '';

	/**
	 * Methods allowed for the model.
	 *
	 * @var array
	 */
	protected $methods = [ 'index', 'create', 'find', 'edit', 'delete' ];

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		// nothing to register.
	}

	/**
	 * Bootstrap routes
	 *
	 * @param  \Pimple\Container $container Service Container.
	 *
	 * @return void
	 */
	public function bootstrap( $container ) {
		add_action( 'rest_api_init', [ $this, 'registerModelRoutes' ] );
	}

	/**
	 * Do we have the method
	 *
	 * @param string $name
	 * @return boolean
	 */
	public function hasMethod( $name ) {
		return in_array( $name, $this->methods, true );
	}

	/**
	 * Do we have all these methods.
	 *
	 * @param array $methods Array of method names.
	 * @return boolean
	 */
	public function hasAnyMethods( $methods = [] ) {
		foreach ( $methods as $method ) {
			if ( $this->hasMethod( $method ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Register REST Routes
	 *
	 * @return void
	 */
	public function registerModelRoutes() {
		if ( $this->hasAnyMethods( [ 'index', 'create' ] ) ) {
			register_rest_route(
				"$this->name/v$this->version",
				"$this->endpoint",
				array_filter(
					[
						( $this->hasMethod( 'index' ) ? [
							'methods'             => \WP_REST_Server::READABLE,
							'callback'            => $this->callback( $this->controller, 'index' ),
							'permission_callback' => [ $this, 'get_items_permissions_check' ],
							'args'                => $this->get_collection_params(),
						] : [] ),
						( $this->hasMethod( 'create' ) ? [
							'methods'             => \WP_REST_Server::CREATABLE,
							'callback'            => $this->callback( $this->controller, 'create' ),
							'permission_callback' => [ $this, 'create_item_permissions_check' ],
						] : [] ),
						'schema' => [ $this, 'get_item_schema' ],
					]
				)
			);
		}

		if ( $this->hasAnyMethods( [ 'find', 'edit', 'delete' ] ) ) {
			register_rest_route(
				"$this->name/v$this->version",
				$this->endpoint . '/(?P<id>[^/]+)',
				array_filter(
					[
						( $this->hasMethod( 'find' ) ? [
							'methods'             => \WP_REST_Server::READABLE,
							'callback'            => $this->callback( $this->controller, 'find' ),
							'permission_callback' => [ $this, 'get_item_permissions_check' ],
						] : [] ),
						( $this->hasMethod( 'edit' ) ? [
							'methods'             => \WP_REST_Server::EDITABLE,
							'callback'            => $this->callback( $this->controller, 'edit' ),
							'permission_callback' => [ $this, 'update_item_permissions_check' ],
						] : [] ),
						( $this->hasMethod( 'delete' ) ? [
							'methods'             => \WP_REST_Server::DELETABLE,
							'callback'            => $this->callback( $this->controller, 'delete' ),
							'permission_callback' => [ $this, 'delete_item_permissions_check' ],
						] : [] ),
						// Register our schema callback.
						'schema' => [ $this, 'get_item_schema' ],
					]
				)
			);
		}

		$this->registerRoutes();
	}

	/**
	 * Additional routes to register for the model.
	 *
	 * @return void
	 */
	public function registerRoutes() {
	}

	/**
	 * Process the callback for the route.
	 *
	 * @param string $class Class name.
	 * @param string $method Class method.
	 * @return callback
	 */
	public function callback( $class, $method ) {
		return function ( $request ) use ( $class, $method ) {
			// get and call controller with request.
			$controller = \CheckoutEngine::closure()->method( $class, $method );
			$model      = $controller( $request );

			// check and filter context.
			$context = ! empty( $request['context'] ) ? $request['context'] : 'view';

			if ( is_wp_error( $model ) ) {
				return $model;
			}

			// remove wp_created_by to prevent user ids from being leaked.
			if ( 'edit' !== $context && ! empty( $model->metadata->wp_created_by ) ) {
				unset( $model->metadata->wp_created_by );
			}

			return rest_ensure_response( $this->filter_response_by_context( is_a( $model, Model::class ) ? $model->toArray() : $model, $context ) );
		};
	}

	/**
	 * Check permissions for specific properties of the request.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @param array            $keys Keys to check.
	 *
	 * @return boolean
	 */
	protected function requestOnlyHasKeys( $request, $keys ) {
		$keys = array_merge( $keys, [ 'context', '_locale' ] );
		foreach ( $request->get_params() as $key => $value ) {
			if ( ! in_array( $key, $keys, true ) ) {
				return false;
			}
		}
	}

	/**
	 * Retrieves the query params for collections.
	 *
	 * @return array
	 */
	public function get_collection_params() {
		return [];
	}

	/**
	 * Set these all as false by default
	 * in case parent class doesn't implement them.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return false
	 */
	public function get_item_permissions_check( $request ) {
		return false;
	}

	/**
	 * Set these all as false by default
	 * in case parent class doesn't implement them.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return false
	 */
	public function get_items_permissions_check( $request ) {
		return false;
	}

	/**
	 * Set these all as false by default
	 * in case parent class doesn't implement them.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return false
	 */
	public function create_item_permissions_check( $request ) {
		return false;
	}

	/**
	 * Set these all as false by default
	 * in case parent class doesn't implement them.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return false
	 */
	public function update_item_permissions_check( $request ) {
		return false;
	}

	/**
	 * Set these all as false by default
	 * in case parent class doesn't implement them.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 *
	 * @return false
	 */
	public function delete_item_permissions_check( $request ) {
		return false;
	}
}
