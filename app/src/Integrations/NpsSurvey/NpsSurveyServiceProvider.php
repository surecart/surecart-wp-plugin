<?php

namespace SureCart\Integrations\NpsSurvey;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * Provides the NPS Survey service provider.
 */
class NpsSurveyServiceProvider implements ServiceProviderInterface {
	/**
	 * Whether the NPS survey version check has already been performed.
	 *
	 * @var bool
	 */
	private static bool $version_checked = false;

	/**
	 * Register all dependencies in the IoC container.
	 *
	 * @param \Pimple\Container $container Service container.
	 * @return void
	 */
	public function register( $container ) {
		$container['surecart.nps.survey.notice'] = function () {
			return new NpsSurveyNotice();
		};
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		if ( ! $container['surecart.account']->is_connected ) {
			return;
		}

		$this->versionCheck();

		if ( did_action( 'init' ) ) {
			$this->loadNpsSurveyLibrary();
		} else {
			add_action( 'init', [ $this, 'loadNpsSurveyLibrary' ], 999 );
		}

		// Load the NPS survey notice on all admin pages, but it will only display on SureCart admin pages.
		\SureCart::resolve( 'surecart.nps.survey.notice' )->bootstrap();
	}

	/**
	 * Register SureCart's NPS survey version in the global version auction.
	 *
	 * @return void
	 */
	private function versionCheck(): void {
		if ( self::$version_checked ) {
			return;
		}

		$nps_lib_path = SURECART_VENDOR_DIR . '/brainstormforce/nps-survey';

		$file = realpath( $nps_lib_path . '/version.json' );
		if ( ! $file || ! is_file( $file ) ) {
			return;
		}

		$contents = file_get_contents( $file );
		if ( false === $contents ) {
			return;
		}

		$file_data = json_decode( $contents, true );

		global $nps_survey_version, $nps_survey_init;

		$path    = realpath( $nps_lib_path . '/nps-survey.php' );
		$version = $file_data['nps-survey'] ?? 0;

		if ( null === $nps_survey_version ) {
			$nps_survey_version = '0.0.0';
		}

		if ( version_compare( $version, $nps_survey_version, '>=' ) ) {
			$nps_survey_version = $version;
			$nps_survey_init    = $path;
		}

		self::$version_checked = true;
	}

	/**
	 * Load the winning NPS survey library file.
	 *
	 * @return void
	 */
	public function loadNpsSurveyLibrary(): void {
		global $nps_survey_init;

		if ( $nps_survey_init && is_file( $nps_survey_init ) ) {
			include_once $nps_survey_init;
		}
	}
}
