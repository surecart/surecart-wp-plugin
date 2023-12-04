<?php

namespace SureCart\WordPress\Shortcodes;

/**
 * The shortcodes service.
 */
class ShortcodesService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// these require separate methods because they do special things with inner content.
		add_shortcode( 'sc_add_to_cart_button', [ $this, 'addToCartShortcode' ], 10, 2 );
		add_shortcode( 'sc_buy_button', [ $this, 'buyButtonShortcode' ], 10, 2 );
		add_shortcode( 'sc_line_item', '__return_false' );

		// register all other shortcodes.
		$this->registerBlock(
			'sc_form',
			'surecart/checkout-form',
			[
				'id' => null,
			],
		);
		$this->registerBlock(
			'sc_customer_dashboard_button',
			'surecart/customer-dashboard-button',
			[
				'show_icon' => true,
				'type'      => 'primary',
				'size'      => 'medium',
			]
		);
		$this->registerBlock(
			'sc_customer_orders',
			'surecart/customer-orders',
			[ 'title' => '' ]
		);
		$this->registerBlock(
			'sc_customer_billing_details',
			'surecart/customer-billing-details',
			[ 'title' => '' ]
		);
		$this->registerBlock(
			'sc_customer_payment_methods',
			'surecart/customer-payment-methods',
			[ 'title' => '' ]
		);
		$this->registerBlock(
			'sc_customer_subscriptions',
			'surecart/customer-subscriptions',
			[ 'title' => '' ]
		);
		$this->registerBlock(
			'sc_customer_downloads',
			'surecart/customer-downloads',
			[ 'title' => '' ]
		);
		$this->registerBlock(
			'sc_customer_wordpress_account',
			'surecart/wordpress-account',
			[ 'title' => '' ]
		);
		$this->registerBlock(
			'sc_customer_dashboard_page',
			'surecart/dashboard-area',
			[ 'name' => '' ]
		);
		$this->registerBlock(
			'sc_customer_dashboard',
			'surecart/dashboard-area',
			[ 'name' => '' ]
		);
		$this->registerBlock(
			'sc_customer_dashboard_tab',
			'surecart/dashboard-tab',
			[
				'icon'  => 'shopping-bag',
				'panel' => '',
				'title' => 'test',
			]
		);
		$this->registerBlock(
			'sc_cart_menu_icon',
			'surecart/cart-menu-icon',
			[
				'cart_icon'              => 'shopping-bag',
				'cart_menu_always_shown' => true,
			]
		);
		$this->registerBlock(
			'sc_order_confirmation',
			'surecart/order-confirmation',
		);
		$this->registerBlock(
			'sc_order_confirmation_line_items',
			'surecart/order-confirmation-line-items',
		);
		$this->registerBlock(
			'sc_product_list',
			'surecart/product-item-list',
			[
				'ids'                => [],
				'columns'            => 4,
				'sort_enabled'       => true,
				'search_enabled'     => true,
				'pagination_enabled' => true,
				'ajax_pagination'    => true,
				'collection_enabled' => true,
				'type'               => 'all',
				'limit'              => 10,
			]
		);
		$this->registerBlock(
			'sc_product_collection',
			'surecart/product-collection',
			[
				'collection_id'      => '', // mandatory.
				'columns'            => 4,
				'sort_enabled'       => true,
				'search_enabled'     => true,
				'pagination_enabled' => true,
				'ajax_pagination'    => true,
				'limit'              => 10,
			]
		);
		$this->registerBlock(
			'sc_product_description',
			'surecart/product-description',
		);
		$this->registerBlock(
			'sc_product_title',
			'surecart/product-title',
		);
		$this->registerBlock(
			'sc_product_price',
			'surecart/product-price',
		);
		$this->registerBlock(
			'sc_product_price_choices',
			'surecart/product-price-choices',
			[
				'label'      => __( 'Pricing', 'surecart' ),
				'columns'    => 2,
				'show_price' => true,
			]
		);
		$this->registerBlock(
			'sc_product_media',
			'surecart/product-media',
			[
				'auto_height' => true,
			]
		);
		$this->registerBlock(
			'sc_product_quantity',
			'surecart/surecart/product-quantity',
		);
		$this->registerBlock(
			'sc_product_cart_button',
			'surecart/product-buy-button',
			[
				'add_to_cart' => true,
				'text'        => __( 'Add To Cart', 'surecart' ),
				'width'       => 100,
			]
		);
	}

	/**
	 * Register shortcode by name
	 *
	 * @param string $name Name of the shortcode.
	 * @param string $block_name The registered block name.
	 * @param array  $defaults Default attributes.
	 *
	 * @return void
	 */
	public function registerBlock( $name, $block_name, $defaults = [] ) {
		add_shortcode(
			$name,
			function( $attributes, $content ) use ( $name, $block_name, $defaults ) {
				// convert comma separated attributes to array.
				if ( is_array( $attributes ) ) {
					foreach ( $attributes as $key => $value ) {
						if ( strpos( $value, ',' ) !== 0 && is_array( $defaults[ $key ] ) ) {
							$attributes[ $key ] = explode( ',', $value );
						}
					}
				}

				$shortcode_attrs = shortcode_atts(
					$defaults,
					$attributes,
					$name
				);

				$block = new \WP_Block(
					[
						'blockName'    => $block_name,
						'attrs'        => $shortcode_attrs,
						'innerContent' => do_shortcode( $content ),
					]
				);
				return $block->render();
			}
		);
	}

	/**
	 * Get specific shortcode atts from content
	 *
	 * @param string $name Name of shortcode.
	 * @param string $content Page content.
	 * @param array  $defaults Defaults for each.
	 * @return array
	 */
	public function getShortcodesAtts( $name, $content, $defaults = [] ) {
		$items = [];

		// if shortcode exists.
		if (
		preg_match_all( '/' . get_shortcode_regex() . '/s', $content, $matches )
		&& array_key_exists( 2, $matches )
		&& in_array( $name, $matches[2] )
		) {
			foreach ( (array) $matches[0] as $key => $value ) {
				if ( strpos( $value, $name ) !== false ) {
					$items[] = wp_parse_args(
						shortcode_parse_atts( $matches[3][ $key ] ),
						$defaults
					);
				}
			}
		}

		return $items;
	}

	/**
	 * Add To Cart Shortcode
	 *
	 * @param array  $atts An array of attributes.
	 * @param string $content Content.
	 *
	 * @return string
	 */
	public function addToCartShortcode( $atts, $content ) {
		$atts = shortcode_atts(
			[
				'price_id'    => null,
				'variant_id'  => null,
				'type'        => 'primary',
				'size'        => 'medium',
				'button_text' => $content,
			],
			$atts,
			'sc_add_to_cart_button'
		);

		return ( new \WP_Block(
			[
				'blockName' => 'surecart/add-to-cart-button',
				'attrs'     => $atts,
			]
		) )->render();
	}

	/**
	 * Buy button shortcode.
	 *
	 * @param array  $atts An array of attributes.
	 * @param string $content Content.
	 *
	 * @return string
	 */
	public function buyButtonShortcode( $atts, $content ) {
		// Remove inner shortcode from buy button label.
		$label = strip_shortcodes( $content );
		$atts  = shortcode_atts(
			[
				'type'  => 'primary',
				'size'  => 'medium',
				'label' => $label,
			],
			$atts,
			'sc_buy_button'
		);

		$atts['line_items'] = (array) $this->getShortcodesAtts(
			'sc_line_item',
			$content,
			[
				'price_id' => null,
				'quantity' => 1,
			]
		);

		foreach ( $atts['line_items'] as $key => $line_item ) {
			$atts['line_items'][ $key ]['id'] = $line_item['price_id'];
		}

		return ( new \WP_Block(
			[
				'blockName' => 'surecart/buy-button',
				'attrs'     => $atts,
			]
		) )->render();
	}
}
