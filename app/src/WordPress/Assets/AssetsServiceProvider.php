<?php

namespace CheckoutEngine\WordPress\Assets;

use WPEmerge\ServiceProviders\ServiceProviderInterface;

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
		$container['checkout_engine.assets'] = function () {
			return new AssetsService();
		};

		$app = $container[ WPEMERGE_APPLICATION_KEY ];

		$app->alias( 'assets', 'checkout_engine.assets' );
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
		$asset_file = include trailingslashit( $this->container[ WPEMERGE_CONFIG_KEY ]['app_core']['path'] ) . 'dist/admin/store/data/register.asset.php';
		wp_register_script(
			'ce-core-data',
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . 'dist/admin/store/data/register.js',
			array_merge( [ 'checkout-engine-components' ], $asset_file['dependencies'] ),
			filemtime( trailingslashit( $this->container[ WPEMERGE_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/checkout-engine/checkout-engine.esm.js' ),
			true
		);

		// ui
		$asset_file = include trailingslashit( $this->container[ WPEMERGE_CONFIG_KEY ]['app_core']['path'] ) . 'dist/admin/store/ui/register.asset.php';
		wp_register_script(
			'ce-ui-data',
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . 'dist/admin/store/ui/register.js',
			array_merge( [ 'checkout-engine-components' ], $asset_file['dependencies'] ),
			filemtime( trailingslashit( $this->container[ WPEMERGE_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/checkout-engine/checkout-engine.esm.js' ),
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
		if ( 'checkout-engine-components' !== $handle ) {
			return $tag;
		}

		return str_replace( '<script src', '<script type="module" src', $tag );
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
			'checkout-engine-themes-default',
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . 'dist/components/checkout-engine/checkout-engine.css',
			[],
			filemtime( trailingslashit( $this->container[ WPEMERGE_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/checkout-engine/checkout-engine.css' ),
		);
		wp_add_inline_style(
			'checkout-engine-themes-default',
			'
			ce-form, ce-checkout {
				visibility: hidden;
				opacity: 0;
				transition: opacity 0.1s ease;
			}
			ce-checkout.hydrated,
			ce-form.hydrated {
				visibility: visible;
				opacity: 1;
			}
		'
		);
	}

	/**
	 * Register the component scripts
	 *
	 * @return void
	 */
	public function registerComponentScripts() {
		wp_register_script(
			'checkout-engine-components',
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . 'dist/components/checkout-engine/checkout-engine.esm.js',
			[ 'wp-api-fetch' ],
			filemtime( trailingslashit( $this->container[ WPEMERGE_CONFIG_KEY ]['app_core']['path'] ) . 'dist/components/checkout-engine/checkout-engine.esm.js' ),
			true
		);
		wp_set_script_translations( 'checkout-engine-components', 'checkout_engine' );
		wp_localize_script(
			'checkout-engine-components',
			'ceData',
			[
				'pages' => [
					'dashboard' => \CheckoutEngine::pages()->url( 'dashboard' ),
				],
			]
		);
		add_action(
			'wp_footer',
			function() { ?>
		<ce-register-icon-library></ce-register-icon-library>
		<script>
			(async () => {
				await customElements.whenDefined('ce-register-icon-library');
				var library = document.querySelector('ce-register-icon-library');
				await library.registerIconLibrary(
					'default', {
						resolver: function(name) {
							return '<?php echo plugin_dir_url( CHECKOUT_ENGINE_PLUGIN_FILE ); ?>resources/icons/feather/' + name + '.svg'
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
		<ce-register-icon-library></ce-register-icon-library>
		<script>
			(async () => {
				await customElements.whenDefined('ce-register-icon-library');
				var library = document.querySelector('ce-register-icon-library');
				await library.registerIconLibrary(
					'default', {
						resolver: function(name) {
							return '<?php echo plugin_dir_url( CHECKOUT_ENGINE_PLUGIN_FILE ); ?>resources/icons/feather/' + name + '.svg'
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
		 wp_enqueue_style( 'checkout-engine-themes-default' );
	}

	/**
	 * Enqueue components
	 *
	 * @return void
	 */
	public function enqueueComponents() {
		wp_enqueue_script( 'checkout-engine-components' );
		wp_enqueue_style( 'checkout-engine-themes-default' );

		wp_add_inline_script(
			'wp-api-fetch',
			implode(
				"\n",
				[
					'window.ce = window.ce || {};',
					sprintf(
						'wp.apiFetch.use( wp.apiFetch.createRootURLMiddleware( " % s" ) );',
						esc_url_raw( get_rest_url() ) . 'checkout_engine/v1/'
					),
				]
			)
		);

		// add our own middleware to api fetch.
		wp_add_inline_script(
			'wp-api-fetch',
			implode(
				"\n",
				[
					sprintf(
						'wp.apiFetch.nonceMiddleware = wp.apiFetch.createNonceMiddleware( " % s" );',
						( wp_installing() && ! is_multisite() ) ? '' : wp_create_nonce( 'wp_rest' )
					),
					'wp.apiFetch.use( wp.apiFetch.nonceMiddleware );',
					'wp.apiFetch.use( wp.apiFetch.mediaUploadMiddleware );',
					sprintf(
						'wp.apiFetch.nonceEndpoint = " % s";',
						admin_url( 'admin-ajax.php?action=ce-rest-nonce' )
					),
				]
			),
		);
	}

	/**
	 * Enqueue default theme
	 *
	 * @return void
	 */
	public function editorAssets() {
		$asset_file = include trailingslashit( $this->container[ WPEMERGE_CONFIG_KEY ]['app_core']['path'] ) . 'dist/blocks/blocks.asset.php';

		\CheckoutEngine::core()->assets()->enqueueScript(
			'checkout-engine-blocks',
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . 'dist/blocks/blocks.js',
			array_merge( [ 'checkout-engine-components' ], $asset_file['dependencies'] ),
			true
		);

		wp_localize_script(
			'checkout-engine-blocks',
			'ceData',
			[
				'keys' => [
					'stripe'          => 'pk_test_51FrVhTKIxBDlEhovnzFUjE1K3e8s9QInYW4a2S1BrYYgePmNIFZUCSvUY90MmD10PNh0ZxYFoxkW6P1xsfPofCYG00JTdSKWFO',
					'stripeAccountId' => 'acct_1J8pDC2ejo5ZGM5Q',
				],
			]
		);

		\CheckoutEngine::core()->assets()->enqueueStyle(
			'checkout-engine-blocks-style',
			trailingslashit( \CheckoutEngine::core()->assets()->getUrl() ) . 'dist/blocks/style-blocks.css',
			[],
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
