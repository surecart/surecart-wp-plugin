<?php

namespace CheckoutEngine\Rest;

use CheckoutEngine\Rest\RestServiceInterface;

/**
 * Abstract Rest Service Provider interface
 */
abstract class RestServiceProvider extends \WP_REST_Controller implements RestServiceInterface {
	/**
	 * Plugin namespace.
	 *
	 * @var string
	 */
	protected $name = 'checkout-engine';

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
	 * Register REST Routes
	 *
	 * @return void
	 */
	public function registerModelRoutes() {
		register_rest_route(
			"$this->name/v$this->version",
			"$this->endpoint",
			[
				( in_array( 'index', $this->methods, true ) ? [
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => $this->callback( $this->controller, 'index' ),
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
				] : null ),
				( in_array( 'create', $this->methods, true ) ? [
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => $this->callback( $this->controller, 'create' ),
					'permission_callback' => [ $this, 'create_item_permissions_check' ],
				] : null ),
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			"$this->name/v$this->version",
			$this->endpoint . '/(?P<id>[\S]+)',
			[
				( in_array( 'find', $this->methods, true ) ? [
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => $this->callback( $this->controller, 'find' ),
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
				] : null ),
				( in_array( 'edit', $this->methods, true ) ? [
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => $this->callback( $this->controller, 'edit' ),
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
				] : null ),
				( in_array( 'delete', $this->methods, true ) ? [
					'methods'             => \WP_REST_Server::DELETABLE,
					'callback'            => $this->callback( $this->controller, 'delete' ),
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
				] : null ),
				// Register our schema callback.
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

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

			return rest_ensure_response( $this->filter_response_by_context( $model->toArray(), $context ) );
		};
	}
}
