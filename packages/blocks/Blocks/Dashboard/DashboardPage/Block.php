<?php

namespace SureCartBlocks\Blocks\Dashboard\DashboardPage;

use SureCartBlocks\Blocks\Dashboard\DashboardPage;

/**
 * Checkout block
 */
class Block extends DashboardPage {
	/**
	 * Individual block controllers.
	 *
	 * @var array
	 */
	protected $blocks = [
		'subscription'   => \SureCartBlocks\Controllers\SubscriptionController::class,
		'payment_method' => \SureCartBlocks\Controllers\PaymentMethodController::class,
		'charge'         => \SureCartBlocks\Controllers\ChargeController::class,
		'order'          => \SureCartBlocks\Controllers\OrderController::class,
		'user'           => \SureCartBlocks\Controllers\UserController::class,
		'customer'       => \SureCartBlocks\Controllers\CustomerController::class,
		'download'       => \SureCartBlocks\Controllers\DownloadController::class,
		'invoice'        => \SureCartBlocks\Controllers\InvoiceController::class,
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
		// get the current page tab and possible id.
		$tab = isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : false;

		// make sure we are on the correct tab.
		if ( empty( $attributes['name'] ) || $tab !== $attributes['name'] ) {
			return '';
		}

		$model = isset( $_GET['model'] ) ? sanitize_text_field( wp_unslash( $_GET['model'] ) ) : false;

		// call the correct block controller.
		if ( ! empty( $this->blocks[ $model ] ) ) {
			$action = isset( $_GET['action'] ) ? sanitize_text_field( wp_unslash( $_GET['action'] ) ) : false;

			if ( method_exists( $this->blocks[ $model ], $action ) ) {
				$block = new $this->blocks[ $model ]();
				return $block->$action();
			}
		}

		return '<ce-spacing style="--spacing: var(--ce-spacing-xxx-large); font-size: 15px;">' . wp_kses_post( $content ) . '</ce-spacing>';
	}
}
