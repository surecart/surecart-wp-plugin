<?php

namespace SureCart\WordPress;

/**
 * Recaptcha Validation Service.
 */
class RecaptchaValidationService {

	/**
	 * Get reCaptcha min score.
	 *
	 * @return string
	 */
	public function get_min_score() {
		return get_option( 'sc_recaptcha_min_score', true );
	}

    /**
	 * Get reCaptcha secret key.
	 *
	 * @return string
	 */
	public function get_secret_key() {
		return get_option( 'sc_recaptcha_secret_key', true );
	}

    /**
	 * Get reCaptcha response data.
	 *
	 * @param $grecaptcha recaptcha token.
	 * @return object
	 */
	public function get_response( $grecaptcha ) {
		$recaptcha_verify = wp_remote_post(
            'https://www.google.com/recaptcha/api/siteverify',
            [
                'method' => 'POST',
                'body'   => [
                    'secret'   => $this->get_secret_key(),
                    'response' => $grecaptcha,
                ],
            ]
        );

        return json_decode( wp_remote_retrieve_body( $recaptcha_verify ) );
	}

    /**
	 * Check is validate token.
	 *
	 * @param string $grecaptcha recaptcha token.
     * @param object $verify_data recaptcha token.
	 * @return bool
	 */
	public function is_validate_token( $grecaptcha_token, $verify_data = '' ) {
        $verify_data = ! empty( $verify_data ) ? $verify_data : $this->get_response( $grecaptcha_token );

        if ( ! $verify_data->success ) {
            return false;
        }

        return true;
	}

    /**
	 * Check is validate score.
	 *
	 * @param string $grecaptcha_token recaptcha token.
	 * @param object $verify_data recaptcha token.
	 * @return bool
	 */
	public function is_validate_score( $grecaptcha_token, $verify_data = '' ) {
        $verify_data = ! empty( $verify_data ) ? $verify_data : $this->get_response( $grecaptcha_token );

        if ( $verify_data->score && $verify_data->score < $this->get_min_score() ) {
            return false;
        }

        return true;
	}
}
