<?php

namespace SureCart\Integrations\NpsSurvey;

/**
 * Nps Survey Service.
 */
class NpsSurveyService {
	/**
	 * Nps Library Path.
	 *
	 * @var string
	 */
	public string $nps_lib_path;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->nps_lib_path = SURECART_VENDOR_DIR . '/brainstormforce/nps-survey';
	}

	/**
	 * Bootstrap.
	 *
	 * @return void
	 */
	public function bootstrap(): void {
		$this->versionCheck();
		add_action( 'init', array( $this, 'load' ), 999 );
	}

	/**
	 * Version Check.
	 *
	 * @return void
	 */
	public function versionCheck() {
		$file = realpath( $this->nps_lib_path . '/version.json' );
		if ( ! $file || ! is_file( $file ) ) {
			return;
		}

		$file_data = json_decode( file_get_contents( $file ), true );

		global $nps_survey_version, $nps_survey_init;

		$path = realpath( $this->nps_lib_path . '/nps-survey.php' );

		$version = isset( $file_data['nps-survey'] ) ? $file_data['nps-survey'] : 0;

		if ( null === $nps_survey_version ) {
			$nps_survey_version = '1.0.0';
		}

		// Compare versions.
		if ( version_compare( $version, $nps_survey_version, '>=' ) ) {
			$nps_survey_version = $version;
			$nps_survey_init    = $path;
		}
	}

	/**
	 * Load latest plugin.
	 *
	 * @return void
	 */
	public function load(): void {
		global $nps_survey_version, $nps_survey_init;

		if ( is_file( realpath( $nps_survey_init ) ) ) {
			include_once realpath( $nps_survey_init );
		}
	}
}
