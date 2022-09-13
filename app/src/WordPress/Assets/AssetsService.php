<?php

namespace SureCart\WordPress\Assets;

/**
 * Our assets service.
 */
class AssetsService {
	/**
	 * Holds the loader.
	 *
	 * @var Object
	 */
	protected $loader;

	/**
	 * Holds the styles
	 *
	 * @var Object
	 */
	protected $styles;

	/**
	 * Holds the scripts service.
	 *
	 * @var Object
	 */
	protected $scripts;

	/**
	 * The service container.
	 *
	 * @var \Pimple\Container $container Service Container.
	 */
	protected $container;

	/**
	 * The preload Service
	 *
	 * @var \SureCart\WordPress\Assets\PreloadService
	 */
	protected $preload;

	/**
	 * Get the loader.
	 *
	 * @param Object $loader The loader.
	 */
	public function __construct( $loader, $scripts, $styles, $container ) {
		$this->loader    = $loader;
		$this->scripts   = $scripts;
		$this->styles    = $styles;
		$this->container = $container;
		$this->preload   = ( new PreloadService( trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/stats.json' ) );
	}

	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// register assets we will reuse.
		add_action( 'init', [ $this->scripts, 'register' ] );
		add_action( 'init', [ $this->styles, 'register' ] );

		// front-end styles. These only load when the block is being rendered on the page.
		$this->loader->whenRendered( 'surecart/form', [ $this, 'enqueueComponents' ] );
		$this->loader->whenRendered( 'surecart/buy-button', [ $this, 'enqueueComponents' ] );
		$this->loader->whenRendered( 'surecart/customer-dashboard', [ $this, 'enqueueDashboard' ] );
		$this->loader->whenRendered( 'surecart/checkout-form', [ $this, 'enqueueForm' ] );
		$this->loader->whenRendered( 'surecart/order-confirmation', [ $this, 'enqueueComponents' ] );

		// block editor.
		add_action( 'enqueue_block_editor_assets', [ $this, 'editorAssets' ] );
	}

	/**
	 * Enqueue the checkout form.
	 * This will also preload key components to prevent additional rendering delay.
	 *
	 * @return void
	 */
	public function enqueueForm() {
		$this->enqueueComponents();
		$this->preload->add(
			[
				'sc-checkout',
				'sc-form',
				'sc-columns',
				'sc-column',
				'sc-form-control',
				'sc-total',
				'sc-input',
				'sc-customer-name',
				'sc-customer-email',
				'sc-order-shipping-address',
				'sc-order-summary',
				'sc-order-submit',
				'sc-line-items',
				'sc-line-item-tax',
				'sc-format-number',
				'sc-order-coupon-form',
				'sc-coupon-form',
				'sc-checkout-unsaved-changes-warning',
				'sc-product-line-item',
				'sc-line-item-total',
				'sc-divider',
				'sc-button',
				'sc-card',
				'sc-line-items-provider',
				'sc-spinner',
				'sc-skeleton',
				'sc-cart-loader',
			]
		);
	}

	/**
	 * Enqueue and preload dashboard components.
	 * This will also preload key components to prevent additional rendering delay.
	 *
	 * @return void
	 */
	public function enqueueDashboard() {
		$this->enqueueComponents();
		$this->preload->add(
			[
				'sc-tab',
				'sc-tab-group',
				'sc-spacing',
				'sc-orders-list',
				'sc-dashboard-downloads-list',
				'sc-subscriptions-list',
				'sc-payment-methods-list',
				'sc-dashboard-customer-details',
				'sc-wordpress-user',
				'sc-format-number',
				'sc-button',
				'sc-flex',
				'sc-divider',
				'sc-stacked-list',
				'sc-stacked-list-row',
				'sc-pagination',
				'sc-skeleton',
			]
		);
	}

	/**
	 * Enqueue editor styles and scripts.
	 */
	public function editorAssets() {
		$this->scripts->enqueueEditor();
		$this->styles->enqueueEditor();
	}

	/**
	 * EnqueueComponents.
	 *
	 * @return void
	 */
	public function enqueueComponents() {
		$this->scripts->enqueueFront();
		$this->styles->enqueueFront();
	}

	/**
	 * Output brand colors.
	 *
	 * @return void
	 */
	public function printBrandColors() {
		$this->styles->addInlineBrandColors( 'surecart-themes-default' );
	}

	/**
	 * This adds component data to the component when it's defined at runtime.
	 *
	 * @param string $tag Tag of the web component.
	 * @param string $selector Specific selector (class or id).
	 * @param array  $data Data to add.
	 * @return void
	 */
	public function addComponentData( $tag, $selector, $data = [] ) {
		add_action(
			'wp_footer',
			function () use ( $tag, $selector, $data ) {
				return $this->outputComponentScript( $tag, $selector, $data );
			}
		);
	}

	/**
	 * Should we use the esm loader directly?
	 * If false, we inject the loader script at runtime.
	 *
	 * @return boolean
	 */
	public function usesEsmLoader() {
		return (bool) get_option( 'surecart_use_esm_loader', false );
	}

	/**
	 * Output the component initialization script.
	 *
	 * @param string $tag Tag of the web component.
	 * @param string $selector Specific selector (class or id).
	 * @param array  $data Data to add.
	 */
	public function outputComponentScript( $tag, $selector, $data = [] ) {
		?>
		<script>
			(async () => {
				await customElements.whenDefined('<?php echo esc_js( $tag ); ?>');
				var component = document.querySelector('<?php echo esc_js( $tag . $selector ); ?>');
				if (!component) return;
				<?php
				foreach ( $data as $key => $value ) {
					echo "\n";
					echo esc_js( "component.$key = " );
					echo wp_json_encode( $value );
					echo ';';
				}
				?>
			})();
		</script>
		<?php
	}
}
