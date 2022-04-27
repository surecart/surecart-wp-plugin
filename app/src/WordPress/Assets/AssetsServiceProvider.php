<?php

namespace SureCart\WordPress\Assets;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register and enqueues assets.
 */
class AssetsServiceProvider implements ServiceProviderInterface {
	/**
	 * Holds the service container
	 *
	 * @var \Pimple\Container
	 */
	protected $container;

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		$container['surecart.assets'] = function () {
			return new AssetsService();
		};

		$app = $container[ SURECART_APPLICATION_KEY ];

		$app->alias( 'assets', 'surecart.assets' );
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		$this->container = $container;

		// add module to components tag.
		add_filter( 'script_loader_tag', [ $this, 'componentsTag' ], 10, 3 );

		// register component scripts.
		add_action( 'init', [ $this, 'registerComponents' ] );
		add_action( 'init', [ $this, 'registerDependencies' ] );

		// enqueue assets on front end and editor.
		add_action( 'enqueue_block_editor_assets', [ $this, 'editorAssets' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'frontAssets' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueueComponents' ] );
	}

	public function registerDependencies() {
		// core-data
		$asset_file = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/store/data.asset.php';

		wp_register_script(
			'sc-core-data',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/store/data.js',
			array_merge( [ 'surecart-components' ], $asset_file['dependencies'] ),
			filemtime( trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/store/data.js' ),
			true
		);

		// ui.
		$asset_file = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/store/ui.asset.php';
		wp_register_script(
			'sc-ui-data',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/store/ui.js',
			array_merge( [ 'surecart-components' ], $asset_file['dependencies'] ),
			filemtime( trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/store/ui.js' ),
			true
		);
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
	 * Registers the components script module
	 *
	 * @return void
	 */
	public function registerComponents() {
		$this->registerComponentScripts();
		$this->registerDefaultTheme();
	}

	/**
	 * Register the default theme
	 *
	 * @return void
	 */
	public function registerDefaultTheme() {
		wp_register_style(
			'surecart-themes-default',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/components/surecart/surecart.css',
			[],
			filemtime( trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/surecart/surecart.css' ),
		);
	}

	/**
	 * Register the component scripts
	 *
	 * @return void
	 */
	public function registerComponentScripts() {
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

		wp_localize_script(
			'surecart-components',
			'scData',
			[
				'plugin_url'     => \SureCart::core()->assets()->getUrl(),
				'currency'       => \SureCart::account()->currency,
				'pages'          => [
					'dashboard' => \SureCart::pages()->url( 'dashboard' ),
					'checkout'  => \SureCart::pages()->url( 'checkout' ),
				],
				'root_url'       => esc_url_raw( get_rest_url() ),
				'nonce'          => ( wp_installing() && ! is_multisite() ) ? '' : wp_create_nonce( 'wp_rest' ),
				'nonce_endpoint' => admin_url( 'admin-ajax.php?action=sc-rest-nonce' ),
			]
		);

		add_action(
			'wp_footer',
			function() { ?>
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
							return '<?php echo plugin_dir_url( SURECART_PLUGIN_FILE ); ?>packages/icons/feather/' + name + '.svg'
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

	/**
	 * Enqueue default theme
	 *
	 * @return void
	 */
	public function enqueueDefaultTheme() {
		wp_enqueue_style( 'surecart-themes-default' );

		$brand = \SureCart::account()->brand;

		$style = file_get_contents( plugin_dir_path( SURECART_PLUGIN_FILE ) . 'dist/blocks/cloak.css' );

		$style .= ':root {';
		$style .= '--sc-color-primary-500: #' . ( $brand->color ?? '000' ) . ';';
		$style .= '--sc-focus-ring-color-primary: #' . ( $brand->color ?? '000' ) . ';';
		$style .= '--sc-input-border-color-focus: #' . ( $brand->color ?? '000' ) . ';';
		$style .= '}';

		wp_add_inline_style(
			'surecart-themes-default',
			$style
		);
	}

	/**
	 * Enqueue components
	 *
	 * @return void
	 */
	public function enqueueComponents() {
		if ( ! apply_filters( 'surecart/components/load', true ) ) {
			return;
		}
		wp_enqueue_script( 'surecart-components' );
		wp_enqueue_style( 'surecart-themes-default' );
	}

	/**
	 * Enqueue default theme
	 *
	 * @return void
	 */
	public function editorAssets() {
		$asset_file = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/blocks/library.asset.php';

		\SureCart::core()->assets()->enqueueScript(
			'surecart-blocks',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/blocks/library.js',
			array_merge( [ 'surecart-components' ], $asset_file['dependencies'] ),
			true
		);

		$this->enqueueDefaultTheme();
	}

	/**
	 * Output front-end assets
	 *
	 * @return void
	 */
	public function frontAssets() {
		// TODO: only enqueue when block renders.
		$this->enqueueComponents();
		$this->enqueueDefaultTheme();
	}
}
