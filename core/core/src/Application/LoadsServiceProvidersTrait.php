<?php
/**
 * @package   CheckoutEngineCore
 * @author    Andre Gagnon <me@andregagnon.me>
 * @copyright 2017-2019 Andre Gagnon
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://checkout_engine.com/
 */

namespace CheckoutEngineCore\Application;

use Pimple\Container;
use CheckoutEngineCore\Controllers\ControllersServiceProvider;
use CheckoutEngineCore\Csrf\CsrfServiceProvider;
use CheckoutEngineCore\Exceptions\ConfigurationException;
use CheckoutEngineCore\Exceptions\ExceptionsServiceProvider;
use CheckoutEngineCore\Flash\FlashServiceProvider;
use CheckoutEngineCore\Input\OldInputServiceProvider;
use CheckoutEngineCore\Kernels\KernelsServiceProvider;
use CheckoutEngineCore\Middleware\MiddlewareServiceProvider;
use CheckoutEngineCore\Requests\RequestsServiceProvider;
use CheckoutEngineCore\Responses\ResponsesServiceProvider;
use CheckoutEngineCore\Routing\RoutingServiceProvider;
use CheckoutEngineCore\ServiceProviders\ServiceProviderInterface;
use CheckoutEngineCore\Support\Arr;
use CheckoutEngineCore\View\ViewServiceProvider;

/**
 * Load service providers.
 */
trait LoadsServiceProvidersTrait {
	/**
	 * Array of default service providers.
	 *
	 * @var string[]
	 */
	protected $service_providers = [
		ApplicationServiceProvider::class,
		KernelsServiceProvider::class,
		ExceptionsServiceProvider::class,
		RequestsServiceProvider::class,
		ResponsesServiceProvider::class,
		RoutingServiceProvider::class,
		ViewServiceProvider::class,
		ControllersServiceProvider::class,
		MiddlewareServiceProvider::class,
		CsrfServiceProvider::class,
		FlashServiceProvider::class,
		OldInputServiceProvider::class,
	];

	/**
	 * Register and bootstrap all service providers.
	 *
	 * @codeCoverageIgnore
	 * @param  Container $container
	 * @return void
	 */
	protected function loadServiceProviders( Container $container ) {
		$container[ CHECKOUT_ENGINE_SERVICE_PROVIDERS_KEY ] = array_merge(
			$this->service_providers,
			Arr::get( $container[ CHECKOUT_ENGINE_CONFIG_KEY ], 'providers', [] )
		);

		$service_providers = array_map(
			function ( $service_provider ) use ( $container ) {
				if ( ! is_subclass_of( $service_provider, ServiceProviderInterface::class ) ) {
					throw new ConfigurationException(
						'The following class does not implement ' .
						ServiceProviderInterface::class . ': ' . $service_provider
					);
				}

				// Provide container access to the service provider instance
				// so bootstrap hooks can be unhooked e.g.:
				// remove_action( 'some_action', [\App::resolve( SomeServiceProvider::class ), 'methodAddedToAction'] );
				$container[ $service_provider ] = new $service_provider();

				return $container[ $service_provider ];
			},
			$container[ CHECKOUT_ENGINE_SERVICE_PROVIDERS_KEY ]
		);

		$this->registerServiceProviders( $service_providers, $container );
		$this->bootstrapServiceProviders( $service_providers, $container );
	}

	/**
	 * Register all service providers.
	 *
	 * @param  ServiceProviderInterface[] $service_providers
	 * @param  Container                  $container
	 * @return void
	 */
	protected function registerServiceProviders( $service_providers, Container $container ) {
		foreach ( $service_providers as $provider ) {
			$provider->register( $container );
		}
	}

	/**
	 * Bootstrap all service providers.
	 *
	 * @param  ServiceProviderInterface[] $service_providers
	 * @param  Container                  $container
	 * @return void
	 */
	protected function bootstrapServiceProviders( $service_providers, Container $container ) {
		foreach ( $service_providers as $provider ) {
			$provider->bootstrap( $container );
		}
	}
}
