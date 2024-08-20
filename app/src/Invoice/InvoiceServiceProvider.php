<?php
namespace SureCart\Invoice;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

class InvoiceServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.invoice'] = function () {
			return new InvoiceService();
		};
	}


	/**
	 * Bootstrap any services if needed.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$container['surecart.invoice']->bootstrap();
	}
}
