<?php

namespace SureCart\WordPress;

/**
 * Recaptcha Validation Service.
 */
class RecaptchaValidationService {
	/**
	 * Recaptcha Validation.
	 *
	 * @param $grecaptcha recaptcha token.
	 * @return bool
	 */
	public function validate( $grecaptcha ) {
		$recaptcha_verify = wp_remote_post(
            'https://www.google.com/recaptcha/api/siteverify',
            [
                'method' => 'POST',
                'body'   => [
                    'secret'   => get_option( 'sc_recaptcha_secret_key', true ),
                    'response' => $grecaptcha,
                ],
            ]
        );

        $verifyBody = json_decode( wp_remote_retrieve_body( $recaptcha_verify ) );

        if ( ! $verifyBody->success ) {
            return false;
        }

        if ( $verifyBody->score && $verifyBody->score < get_option( 'sc_recaptcha_min_score', true ) ) {
            return false;
        }

        return true;
	}
}
