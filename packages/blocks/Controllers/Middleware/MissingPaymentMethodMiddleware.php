<?php
namespace SureCartBlocks\Controllers\Middleware;

use Closure;
use SureCart\Models\ManualPaymentMethod;
use SureCart\Models\Subscription;
use SureCartBlocks\Controllers\PaymentMethodController;

/**
 * Handles a showing a view for the missing payment element.
 * If the subscription is missing it.
 */
class MissingPaymentMethodMiddleware {
	/**
	 * Handle the middleware.
	 *
	 * @param string  $action Action.
	 * @param Closure $next Next.
	 * @return function
	 */
	public function handle( string $action, Closure $next ) {
		$id  = sanitize_text_field( wp_unslash( $_GET['id'] ?? '' ) );
		$tab = sanitize_text_field( wp_unslash( $_GET['tab'] ?? '' ) );

		// get the subscription.
		$subscription = Subscription::find( $id );

		// no payment method, show the payment method form.
		if ( empty( $subscription->payment_method ) && empty( $subscription->manual_payment_method ) ) {
			// Check if there is a manual payment method available for merchant.
			// If available, skip redirecting to payment method form.
			$manual_payment_methods = ManualPaymentMethod::where(
				[
					'archived' => false,
					'reusable' => true,
				]
			)->get();
			if ( ! empty( $manual_payment_methods ) ) {
				return $next();
			}

			$current_url = home_url( add_query_arg( [ 'tab' => esc_attr( $tab ) ] ) );

			return ( new PaymentMethodController() )->create(
				[
					'success_url' => $current_url,
				]
			);
		}

		return $next();
	}
}
