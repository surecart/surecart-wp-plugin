<?php

namespace CheckoutEngine\Blocks;

use CheckoutEngine\Controllers\Web\Dashboard\CustomerCheckoutSessionController;
use CheckoutEngine\Controllers\Web\Dashboard\CustomerSubscriptionController;
use CheckoutEngine\Controllers\Web\Dashboard\CustomerChargesController;
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
		if ( ! is_user_logged_in() ) {
			return \CheckoutEngine::blocks()->render( 'web.login' );
		}

		return $content;
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
			$page     = isset( $_GET['current-page'] ) ? sanitize_text_field( wp_unslash( $_GET['current-page'] ) ) : null;
			$callable = $this->getCallback( $callback['index'][0], $callback['index'][1] );
			return $callable( User::current(), $page );
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
