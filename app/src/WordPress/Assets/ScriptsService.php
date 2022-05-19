<?php

namespace SureCart\WordPress\Assets;

/**
 * Handles the component theme.
 */
class ScriptsService {
	/**
	 * Holds the service container
	 *
	 * @var \Pimple\Container
	 */
	protected $container;

	/**
	 * Make sure we change the script loader tag for esm loading.
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function __construct( $container ) {
		$this->container = $container;

		// add module to components tag.
		add_filter( 'script_loader_tag', [ $this, 'componentsTag' ], 10, 3 );
	}

	/**
	 * Add module to the components tag
	 *
	 * @param string $tag Tag output.
	 * @param string $handle Script handle.
	 * @param string $source Script source.
	 *
	 * @return string
	 */
	public function componentsTag( $tag, $handle, $source ) {
		if ( 'surecart-components' !== $handle || ! $source ) {
			return $tag;
		}
		// don't use javascript module if we are not using esm loader.
		if ( ! \SureCart::assets()->usesEsmLoader() ) {
			return $tag;
		}
		// phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript
		return '<script src="' . esc_url_raw( $source ) . '" type="module"></script>';
	}

	/**
	 * Register the component scripts and translations.
	 *
	 * @return void
	 */
	public function register() {
		// should we use the esm loader directly?
		if ( \SureCart::assets()->usesEsmLoader() ) {
			wp_register_script(
				'surecart-components',
				trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/components/surecart/surecart.esm.js',
				[],
				filemtime( trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/surecart/surecart.esm.js' ),
				false
			);
		} else {
			// instead, use a static loader that injects the script at runtime.
			$static_assets = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/static-loader.asset.php';
			wp_register_script(
				'surecart-components',
				trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/components/static-loader.js',
				$static_assets['dependencies'],
				$static_assets['version'],
				true
			);
			wp_localize_script(
				'surecart-components',
				'surecartComponents',
				[
					'url' => trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/components/surecart/surecart.esm.js?ver=' . filemtime( trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/surecart/surecart.esm.js' ),
				]
			);
		}

		wp_set_script_translations( 'surecart-components', 'surecart', WP_LANG_DIR . '/plugins/' );

		// core-data.
		$asset_file = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/store/data.asset.php';
		wp_register_script(
			'sc-core-data',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/store/data.js',
			array_merge( [ 'surecart-components' ], $asset_file['dependencies'] ),
			$asset_file['version'],
			true
		);

		// ui.
		$asset_file = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/store/ui.asset.php';
		wp_register_script(
			'sc-ui-data',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/store/ui.js',
			array_merge( [ 'surecart-components' ], $asset_file['dependencies'] ),
			$asset_file['version'],
			true
		);

		// blocks.
		$asset_file = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/blocks/library.asset.php';
		$deps       = $asset_file['dependencies'];
		// fix bug in deps array.
		$deps[ array_search( 'wp-blockEditor', $deps ) ] = 'wp-block-editor';
		wp_register_script(
			'surecart-blocks',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/blocks/library.js',
			array_merge( [ 'surecart-components' ], $deps ),
			$asset_file['version'],
			true
		);

	}

	/**
	 * Enqueue block front scripts.
	 *
	 * @return void
	 */
	public function enqueueFront() {
		// make sure it is registered.
		$this->register();
		// enqueue it.
		wp_enqueue_script( 'surecart-components' );
		wp_localize_script(
			'surecart-components',
			'scData',
			[
				'root_url'       => esc_url_raw( get_rest_url() ),
				'plugin_url'     => \SureCart::core()->assets()->getUrl(),
				'currency'       => \SureCart::account()->currency,
				'pages'          => [
					'dashboard' => \SureCart::pages()->url( 'dashboard' ),
					'checkout'  => \SureCart::pages()->url( 'checkout' ),
				],
				'nonce'          => ( wp_installing() && ! is_multisite() ) ? '' : wp_create_nonce( 'wp_rest' ),
				'nonce_endpoint' => admin_url( 'admin-ajax.php?action=sc-rest-nonce' ),
			]
		);
		$this->printIconLibraryLoader();
	}

	/**
	 * Enqueue editor scripts.
	 *
	 * @return void
	 */
	public function enqueueEditor() {
		$this->enqueueFront();
		$this->enqueueBlocks();
	}

	/**
	 * Enqueue blocks scripts.
	 *
	 * @return void
	 */
	public function enqueueBlocks() {
		wp_enqueue_script( 'surecart-blocks' );
		wp_localize_script(
			'surecart-blocks',
			'scBlockData',
			[
				'processors' => (array) \SureCart::account()->processors ?? [],
				'plugin_url' => \SureCart::core()->assets()->getUrl(),
				'currency'   => \SureCart::account()->currency,
				'beta'       => [
					'stripe_payment_element' => (bool) get_option( 'sc_stripe_payment_element', false ),
				],
				'pages'      => [
					'dashboard' => \SureCart::pages()->url( 'dashboard' ),
					'checkout'  => \SureCart::pages()->url( 'checkout' ),
				],
			]
		);
	}

	/**
	 * Print the icon library loader.
	 *
	 * @return void
	 */
	public function printIconLibraryLoader() {
		add_action(
			'wp_footer',
			function() {
				?>
		<sc-register-icon-library></sc-register-icon-library>
		<script>
			(async () => {
				await customElements.whenDefined('sc-register-icon-library');
				var library = document.querySelector('sc-register-icon-library');
				await library.registerIconLibrary(
					'default', {
						resolver: function(name) {
							return '<?php echo esc_url_raw( plugin_dir_url( SURECART_PLUGIN_FILE ) . "packages/icons/feather/'+name+'.svg" ); ?>';
						},
						mutator: function(svg) {
							return svg.setAttribute('fill', 'none')
						}
					}
				);
			})();
		</script>
				<?php
			}
		);
		add_action(
			'admin_footer',
			function() {
				?>
		<sc-register-icon-library></sc-register-icon-library>
		<script>
			(async () => {
				await customElements.whenDefined('sc-register-icon-library');
				var library = document.querySelector('sc-register-icon-library');
				await library.registerIconLibrary(
					'default', {
						resolver: function(name) {
							return '<?php echo esc_url_raw( plugin_dir_url( SURECART_PLUGIN_FILE ) . "packages/icons/feather/'+name+'.svg" ); ?>';
						},
						mutator: function(svg) {
							return svg.setAttribute('fill', 'none')
						}
					}
				);
			})();
		</script>
				<?php
			}
		);
	}
}
