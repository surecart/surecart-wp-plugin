<?php

namespace SureCartBlocks\Blocks\Form;

use SureCart\Models\ManualPaymentMethod;
use SureCart\Models\Processor;
use SureCartBlocks\Blocks\BaseBlock;

/**
 * Checkout block
 */
class Block extends BaseBlock {
	/**
	 * Get the style for the block
	 *
	 * @param  array $attributes Block attributes.
	 * @return string
	 */
	public function getStyle( $attributes ) {
		$style  = 'text-align: left;';
		$style .= '--sc-form-row-spacing: ' . ( $attributes['gap'] ?? '25' ) . ';';
		if ( ! empty( $attributes['color'] ) ) {
			$style .= '--sc-color-primary-500: ' . sanitize_hex_color( $attributes['color'] ) . ';';
			$style .= '--sc-focus-ring-color-primary: ' . sanitize_hex_color( $attributes['color'] ) . ';';
			$style .= '--sc-input-border-color-focus: ' . sanitize_hex_color( $attributes['color'] ) . ';';
		}
		return $style;
	}

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		global $sc_form_id;
		$post = get_post( $sc_form_id );
		$user = wp_get_current_user();

		$processors = Processor::get();
		if ( is_wp_error( $processors ) ) {
			$processors = [];
		}

		/**
		 * Filter - Do not persist the cart.
		 *
		 * @param bool $do_not_persist_cart Do not persist the cart.
		 */
		$do_not_persist_cart = apply_filters( 'surecart/do_not_persist_cart', $attributes['do_not_persist_cart'] ?? true );

		// If default Checkout page, then we need to persist the cart.
		if ( \SureCart::forms()->getDefaultId() === $post->ID ) {
			$do_not_persist_cart = false;
		}

		add_filter(
			'surecart-components/scData',
			function( $data ) use ( $do_not_persist_cart ) {
				$data['do_not_persist_cart'] = $do_not_persist_cart;
				return $data;
			}
		);

		// set the initial state.
		sc_initial_state(
			array_filter(
				[
					'checkout'   => [
						'formId'                   => $attributes['form_id'] ?? $sc_form_id,
						'mode'                     => apply_filters( 'surecart/payments/mode', $attributes['mode'] ?? 'live' ),
						'product'                  => $attributes['product'] ?? [],
						'currencyCode'             => $attributes['currency'] ?? \SureCart::account()->currency,
						'groupId'                  => 'sc-checkout-' . ( $attributes['form_id'] ?? $sc_form_id ),
						'abandonedCheckoutEnabled' => ! is_admin(),
						'taxProtocol'              => \SureCart::account()->tax_protocol,
						'isCheckoutPage'           => true,
						'validateStock'            => ! is_admin(),
					],
					'processors' => [
						'processors'           => array_values(
							array_filter(
								$processors ?? [],
								function( $processor ) {
									return $processor->approved && $processor->enabled;
								}
							)
						),
						'manualPaymentMethods' => (array) ManualPaymentMethod::where( [ 'archived' => false ] )->get() ?? [],
						'config'               => [
							'stripe' => [
								'paymentElement' => (bool) get_option( 'sc_stripe_payment_element', false ),
							],
						],
					],
					'user'       => [
						'loggedIn' => is_user_logged_in(),
						'email'    => $user->user_email,
						'name'     => $user->display_name,
					],
					'form'       => array_filter(
						[
							'text' => array_filter(
								[
									'loading' => array_filter( $attributes['loading_text'] ?? [] ),
									'success' => array_filter( $attributes['success_text'] ?? [] ),
								]
							),
						]
					),
				]
			)
		);

		if ( ! empty( $attributes['prices'] ) ) {
			$existing   = $this->getExistingLineItems();
			$line_items = $this->convertPricesToLineItems( $attributes['prices'] );
			sc_initial_state(
				[
					'checkout' => [
						'initialLineItems' => array_merge( $existing, $line_items ),
					],
				]
			);
		}

		return \SureCart::blocks()->render(
			'blocks/form',
			[
				'align'            => $attributes['align'] ?? '',
				'modified'         => $post->post_modified_gmt ?? '',
				'honeypot_enabled' => (bool) get_option( 'surecart_honeypot_enabled', true ),
				'classes'          => $this->getClasses( $attributes ),
				'style'            => $this->getStyle( $attributes ),
				'content'          => $content,
				'id'               => 'sc-checkout-' . ( $attributes['form_id'] ?? $sc_form_id ),
				'success_url'      => ! empty( $attributes['success_url'] ) ? $attributes['success_url'] : \SureCart::pages()->url( 'order-confirmation' ),
			]
		);
	}

	/**
	 * Get any existing line items.
	 *
	 * @return array
	 */
	public function getExistingLineItems() {
		$initial = \SureCart::state()->getData();
		return ! empty( $initial['checkout']['initialLineItems'] ) ? $initial['checkout']['initialLineItems'] : [];
	}

	/**
	 * Convert price blocks to line items
	 *
	 * @param array $prices Array of prices.
	 *
	 * @return array    Array of line items.
	 */
	public function convertPricesToLineItems( $prices ) {
		return array_values(
			array_map(
				function( $price ) {
					return array_filter(
						[
							'price'    => $price['id'],
							'variant'  => $price['variant_id'] ?? null,
							'quantity' => $price['quantity'] ?? 1,
						]
					);
				},
				$prices
			)
		);
	}
}
