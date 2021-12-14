<?php

namespace CheckoutEngine\Blocks;

use CheckoutEngine\Controllers\CustomerDashboard\CustomerCheckoutSessionController;
use CheckoutEngine\Controllers\CustomerDashboard\CustomerSubscriptionController;
use CheckoutEngine\Controllers\CustomerDashboard\CustomerChargesController;
use CheckoutEngine\Models\User;

/**
 * Checkout block
 */
class CustomerDashboard extends Block {
	/**
	 * Block name
	 *
	 * @var string
	 */
	protected $name = 'customer-dashboard';

	/**
	 * Block attributes
	 *
	 * @var array
	 */
	protected $attributes = [];

	/**
	 * List of controller callbacks for various requests.
	 *
	 * @var array
	 */
	protected $callbacks = [
		'orders'        => [
			'index' => [ CustomerCheckoutSessionController::class, 'index' ],
			'show'  => [ CustomerCheckoutSessionController::class, 'show' ],
		],
		'subscriptions' => [
			'index' => [ CustomerSubscriptionController::class, 'index' ],
			'show'  => [ CustomerSubscriptionController::class, 'show' ],
		],
		'charges'       => [
			'index' => [ CustomerChargesController::class, 'index' ],
			'show'  => [ CustomerChargesController::class, 'show' ],
		],
	];

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		// get the current page tab and possible id
		$tab = isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : 'orders';
		$id  = isset( $_GET['id'] ) ? sanitize_text_field( wp_unslash( $_GET['id'] ) ) : null;

		if ( ! is_user_logged_in() ) {
			return \CheckoutEngine::blocks()->render( 'web.login' );
		}

		// render the route controller.
		return $this->renderRoute( $id, $tab );
	}

	/**
	 * Render the current route for the block based on the id and tab.
	 *
	 * @param string $id ID of model.
	 * @param string $tab Tab name.
	 * @return function
	 */
	public function renderRoute( $id, $tab ) {
		$callback = $this->callbacks[ $tab ] ?? null;
		// callback does not exist.
		if ( ! $callback ) {
			return false;
		}

		// run callback.
		if ( $id ) {
			$callable = $this->getCallback( $callback['show'][0], $callback['show'][1] );
			return $callable( $id );
		} else {
			$callable = $this->getCallback( $callback['index'][0], $callback['index'][1] );
			return $callable( User::current() );
		}

		return false;
	}

	/**
	 * The controller callback.
	 */
	public function getCallback( $class, $method ) {
		return \CheckoutEngine::closure()->method( $class, $method );
	}
}
