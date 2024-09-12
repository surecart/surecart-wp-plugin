<?php

namespace SureCart\WordPress\Admin\PluginCache;

/**
 * Admin plugin cache service.
 */
class AdminPluginCacheService {
	/**
	 * Bootstrap related hooks.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_notices', [ $this, 'showNotice' ] );
	}

	/**
	 * Get list of cache plugins.
	 *
	 * @return array
	 */
	public function getCachePlugins(): array {
		return apply_filters(
			'surecart_cache_plugins',
			[
				'wp-rocket/wp-rocket.php',
				'w3-total-cache/w3-total-cache.php',
				'litespeed-cache/litespeed-cache.php',
				'wp-super-cache/wp-cache.php',
				'autoptimize/autoptimize.php',
				'wp-fastest-cache/wpFastestCache.php',
				'sg-cachepress/sg-cachepress.php',
				'cache-enabler/cache-enabler.php',
				'swift-performance-lite/performance.php',
				'hummingbird-performance/wp-hummingbird.php',
				'wp-optimize/wp-optimize.php',
				'nitropack/main.php',
				'perfmatters/perfmatters.php',
				'wp-asset-clean-up/wpacu.php',
				'flying-pages/flying-pages.php',
				'fast-velocity-minify/fvm.php',
				'breeze/breeze.php',
				'wp-performance-score-booster/wp-performance-score-booster.php',
				'clearfy/clearfy.php',
				'psn-pagespeed-ninja/pagespeedninja.php',
			]
		);
	}

	/**
	 * Show the plugin cache notice.
	 *
	 * @return void
	 */
	public function showNotice(): void {
		$cache_plugins = $this->getCachePlugins();

		foreach ( $cache_plugins as $plugin ) {
			if ( ! is_plugin_active( $plugin ) ) {
				continue;
			}

			$plugin_data = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin );

			echo wp_kses_post(
				\SureCart::notices()->render(
					[
						'name'  => 'sc_plugin_cache_notice_' . sanitize_title( $plugin ),
						'type'  => 'warning',
						'title' => 'SureCart - ' . esc_html( $plugin_data['Name'] ) . ' ' . esc_html__( ' Detected', 'surecart' ),
						'text'  => sprintf(
							/* translators: 1: plugin name, 2: plugin version */
							esc_html__( 'The plugin %1$s (%2$s) has been detected. Please check our documentation to ensure that the plugin is properly configured to work with SureCart.', 'surecart' ),
							$plugin_data['Name'],
							$plugin_data['Version']
						)
						.
						' <a href="https://surecart.com/docs/caching/" target="_blank">' . esc_html__( 'Learn More', 'surecart' ) . '</a>',
					]
				)
			);
		}
	}
}
