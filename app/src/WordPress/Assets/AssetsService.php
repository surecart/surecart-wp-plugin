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
	 * Get the loader.
	 *
	 * @param Object $loader The loader.
	 */
	public function __construct( $loader, $scripts, $styles ) {
		$this->loader  = $loader;
		$this->styles  = $scripts;
		$this->scripts = $styles;
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
		$this->loader->whenRendered( 'surecart/checkout-form', [ $this, 'enqueueComponents' ] );
		$this->loader->whenRendered( 'surecart/buy-button', [ $this, 'enqueueComponents' ] );
		$this->loader->whenRendered( 'surecart/customer-dashboard', [ $this, 'enqueueComponents' ] );
		$this->loader->whenRendered( 'surecart/order-confirmation', [ $this, 'enqueueComponents' ] );

		// block editor.
		add_action( 'enqueue_block_editor_assets', [ $this, 'editorAssets' ] );
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
