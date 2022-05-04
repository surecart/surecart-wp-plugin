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
		$container['surecart.assets'] = function () use ( $container ) {
			return new AssetsService( new BlockAssetsLoadService( $container ), new ScriptsService( $container ), new StylesService( $container ) );
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
		$container['surecart.assets']->bootstrap();

		// // add module to components tag.
		// add_filter( 'script_loader_tag', [ $this, 'componentsTag' ], 10, 3 );

		// // register component scripts.
		// add_action( 'init', [ $this, 'registerComponents' ] );
		// add_action( 'init', [ $this, 'registerDependencies' ] );

		// // enqueue assets on front end and editor.
		// add_action( 'enqueue_block_editor_assets', [ $this, 'editorAssets' ] );
		// $this->frontAssets();
		// add_action( 'admin_enqueue_scripts', [ $this, 'enqueueComponents' ] );
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
	 * Register the component scripts and translations.
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
	}

	/**
	 * Print custom styles for theme.
	 *
	 * @param string $handle Style handle for inline style.
	 *
	 * @return void
	 */
	public function printCustomStyles( $handle = '' ) {
		$brand = \SureCart::account()->brand;

		$style = file_get_contents( plugin_dir_path( SURECART_PLUGIN_FILE ) . 'dist/blocks/cloak.css' );

		$style .= ':root {';
		$style .= '--sc-color-primary-500: #' . ( $brand->color ?? '000' ) . ';';
		$style .= '--sc-focus-ring-color-primary: #' . ( $brand->color ?? '000' ) . ';';
		$style .= '--sc-input-border-color-focus: #' . ( $brand->color ?? '000' ) . ';';
		$style .= '}';

		wp_add_inline_style(
			$handle,
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

		wp_localize_script(
			'surecart-components',
			'scData',
			[
				'root_url'       => esc_url_raw( get_rest_url() ),
				'nonce'          => ( wp_installing() && ! is_multisite() ) ? '' : wp_create_nonce( 'wp_rest' ),
				'nonce_endpoint' => admin_url( 'admin-ajax.php?action=sc-rest-nonce' ),
			]
		);

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
	 * Enqueue editor assets.
	 *
	 * @return void
	 */
	public function editorAssets() {
		// enqueue the default theme.
		$this->enqueueDefaultTheme();

		$asset_file = include trailingslashit( $this->container[ SURECART_CONFIG_KEY ]['app_core']['path'] ) . 'dist/blocks/library.asset.php';
		$deps       = $asset_file['dependencies'];
		// fix bug in deps array.
		$deps[ array_search( 'wp-blockEditor', $deps ) ] = 'wp-block-editor';
		\SureCart::core()->assets()->enqueueScript(
			'surecart-blocks',
			trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/blocks/library.js',
			array_merge( [ 'surecart-components' ], $deps ),
			true
		);

		wp_localize_script(
			'surecart-blocks',
			'scBlockData',
			[
				'plugin_url' => \SureCart::core()->assets()->getUrl(),
				'currency'   => \SureCart::account()->currency,
				'pages'      => [
					'dashboard' => \SureCart::pages()->url( 'dashboard' ),
					'checkout'  => \SureCart::pages()->url( 'checkout' ),
				],
			]
		);
	}

	/**
	 * Output front-end assets
	 *
	 * @return void
	 */
	public function frontAssets() {
		// Enqueue front-end assets when the block is used.
		$this->enqueueBlockViewScript( 'surecart/checkout-form', [ $this, 'enqueueFrontAssets' ] );
		$this->enqueueBlockViewScript( 'surecart/buy-button', [ $this, 'enqueueFrontAssets' ] );
		$this->enqueueBlockViewScript( 'surecart/customer-dashboard', [ $this, 'enqueueFrontAssets' ] );
	}

	/**
	 * Enqueues a frontend script for a specific block.
	 *
	 * Scripts enqueued using this function will only get printed
	 * when the block gets rendered on the frontend.
	 *
	 * @param string $block_name The block name, including namespace.
	 * @param array  $args       An array of arguments [handle,src,deps,ver,media,textdomain].
	 *
	 * @return void
	 */
	public function enqueueBlockViewScript( $block_name, $enqueue_callback = null ) {
		/**
		 * Callback function to register and enqueue scripts.
		 *
		 * @param string $content When the callback is used for the render_block filter,
		 *                        the content needs to be returned so the function parameter
		 *                        is to ensure the content exists.
		 * @return string Block content.
		 */
		$callback = static function( $content, $block ) use ( $block_name, $enqueue_callback ) {
			// Sanity check.
			if ( empty( $block['blockName'] ) || $block_name !== $block['blockName'] ) {
				return $content;
			}

			if ( ! empty( $enqueue_callback ) ) {
				call_user_func( $enqueue_callback, $content, $block );
			}

			return $content;
		};

		/*
		 * The filter's callback here is an anonymous function because
		 * using a named function in this case is not possible.
		 *
		 * The function cannot be unhooked, however, users are still able
		 * to dequeue the script registered/enqueued by the callback
		 * which is why in this case, using an anonymous function
		 * was deemed acceptable.
		 */
		add_filter( 'render_block', $callback, 10, 2 );
	}

	/**
	 * Enqueue front-end assets
	 *
	 * @return void
	 */
	public function enqueueFrontAssets() {
		$this->enqueueDefaultTheme();
		$this->enqueueComponents();
	}
}
