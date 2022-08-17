<?php

namespace SureCart\WordPress;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Register translations.
 */
class TranslationsServiceProvider implements ServiceProviderInterface {
	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		// Nothing to register.
	}

	/**
	 * Bootstrap the service.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function bootstrap( $container ) {
		add_filter( 'loco_compile_single_json', [ $this, 'compileSingleJSON' ], 999, 2 );
		add_filter( 'load_script_translation_file', [ $this, 'loadSingleTranslationFile' ], 999, 3 );
		add_action( 'init', [ $this, 'loadPluginTextDomain' ], 0 );
	}

	/**
	 * Compile javascript translations as a single file.
	 * We need to do this since we lazy load a lot of our scripts.
	 *
	 * @param string $path Path for the json file.
	 * @param string $po_path Path of the po.
	 *
	 * @return string
	 */
	public function compileSingleJSON( $path, $po_path ) {
		$info = pathinfo( $po_path );
		if ( 'surecart' === substr( $info['filename'], 0, 8 ) ) {
			$path = $info['dirname'] . '/' . $info['filename'] . '.json';
		}
		return $path;
	}

	/**
	 * Load the single translation file when the domain loads.
	 *
	 * @param string $file The file.
	 * @param string $handle The script handle.
	 * @param string $domain The domain.
	 *
	 * @return string
	 */
	public function loadSingleTranslationFile( $file, $handle, $domain ) {
		if ( 'surecart' === $domain && is_string( $file ) ) {
			$first_part = substr( $file, 0, strpos( $file, 'plugins/surecart' ) );
			$file       = $first_part . 'plugins/surecart-' . get_locale() . '.json';
		}
		return $file;
	}

	 /**
	  * This is needed for Loco translate to work properly.
	  */
	public function loadPluginTextDomain() {
		load_plugin_textdomain( 'surecart', false, dirname( plugin_basename( SURECART_PLUGIN_FILE ) ) . '/languages/' );
	}
}
