<?php

namespace SureCart\Models;

/**
 * Holds the data of the current account.
 */
class VerifyCode extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'verification_codes/verify';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'verification_code';

	/**
	 * Finalize the session for checkout.
	 *
	 * @return $this|\WP_Error
	 */
	protected function verify() {
		$verify = \SureCart::request(
			$this->endpoint,
			[
				'method' => 'PATCH',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			]
		);

		if ( is_wp_error( $verify ) ) {
			return $verify;
		}

		$this->resetAttributes();

		$this->fill( $verify );

		$this->fireModelEvent( 'verify' );

		return $this;
	}
}
