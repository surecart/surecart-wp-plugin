<?php

namespace SureCart\WordPress\Shortcodes;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register product review shortcodes.
 */
class ProductReviewShortcodesServiceProvider implements ServiceProviderInterface {

	/**
	 * The service container.
	 *
	 * @var \Pimple\Container
	 */
	protected $container;

	/**
	 * Shortcode to block mapping with defaults.
	 *
	 * Each entry maps: shortcode_name => [ block_name, defaults ].
	 *
	 * @var array
	 */
	protected $shortcode_map = [
		'sc_product_review_rating_stars' => [
			'block'    => 'surecart/product-review-average-rating-stars',
			'defaults' => [
				'size'            => '20px',
				'fill_color'      => '',
				'link_to_reviews' => false,
			],
		],
		'sc_product_review_rating_value' => [
			'block'    => 'surecart/product-review-average-rating-value',
			'defaults' => [
				'link_to_reviews' => false,
				'format'          => 'none',
			],
		],
		'sc_product_review_total_count'  => [
			'block'    => 'surecart/product-review-total-rating',
			'defaults' => [
				'show_label'            => true,
				'show_for_zero_reviews' => true,
				'link_to_reviews'       => true,
			],
		],
		'sc_product_review_breakdown'    => [
			'block'    => 'surecart/product-review-breakdown',
			'defaults' => [
				'columns'              => 1,
				'fill_color'           => '',
				'bar_fill_color'       => '',
				'bar_background_color' => '',
			],
		],
		'sc_product_review_add_button'   => [
			'block'    => 'surecart/product-review-add-button',
			'defaults' => [],
		],
	];

	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.shortcodes.product_reviews'] = function ( $c ) {
			return new ProductReviewShortcodesService( $c['surecart.shortcodes'] );
		};
	}

	/**
	 * Bootstrap the service.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		$this->container = $container;

		// Priority 11 to override auto-generated shortcodes from the glob loop at priority 10.
		add_action( 'init', [ $this, 'registerShortcodes' ], 11 );
	}

	/**
	 * Register all product review shortcodes.
	 *
	 * @return void
	 */
	public function registerShortcodes() {
		$service = $this->container['surecart.shortcodes.product_reviews'];

		// Set translatable defaults at runtime (cannot use __() in property declarations).
		$this->shortcode_map['sc_product_review_add_button']['defaults'] = [
			'label'       => __( 'Write a Review', 'surecart' ),
			'button_type' => 'both',
			'icon'        => 'edit-2',
			'className'   => 'is-style-fill',
		];

		// Register simple block shortcodes.
		foreach ( $this->shortcode_map as $shortcode_name => $config ) {
			$this->registerSimpleShortcode( $service, $shortcode_name, $config['block'], $config['defaults'] ?? [] );
		}

		// Register the review list shortcode (needs full inner block markup).
		add_shortcode(
			'sc_product_review_list',
			function ( $attributes, $content ) use ( $service ) {
				$attributes = shortcode_atts(
					[ 'id' => null ],
					$attributes,
					'sc_product_review_list'
				);

				return $service->renderReviewList( $attributes, $content );
			}
		);
	}

	/**
	 * Register a simple block shortcode with product context support.
	 *
	 * @param ProductReviewShortcodesService $service        The service.
	 * @param string                         $shortcode_name The shortcode name.
	 * @param string                         $block_name     The block name.
	 * @param array                          $defaults       Default attributes.
	 *
	 * @return void
	 */
	protected function registerSimpleShortcode( $service, $shortcode_name, $block_name, $defaults = [] ) {
		$defaults = array_merge( [ 'id' => null ], $defaults );

		add_shortcode(
			$shortcode_name,
			function ( $attributes, $content ) use ( $service, $shortcode_name, $block_name, $defaults ) {
				$attributes = shortcode_atts(
					$defaults,
					$attributes,
					$shortcode_name
				);

				// Cast boolean attributes.
				foreach ( $defaults as $key => $default ) {
					if ( is_bool( $default ) && isset( $attributes[ $key ] ) ) {
						$attributes[ $key ] = filter_var( $attributes[ $key ], FILTER_VALIDATE_BOOLEAN );
					}
				}

				// Convert format attribute to className for block style variants.
				if ( ! empty( $attributes['format'] ) && 'none' !== $attributes['format'] ) {
					$attributes['className'] = 'is-style-' . sanitize_html_class( $attributes['format'] );
				}
				unset( $attributes['format'] );

				return $service->renderWithProductContext( $block_name, $attributes, $content );
			}
		);
	}
}
