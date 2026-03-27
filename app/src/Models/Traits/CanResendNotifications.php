<?php

namespace SureCart\Models\Traits;

trait CanResendNotifications {
	/**
	 * Resend the notification for the order.
	 *
	 * @param string $id Model id.
	 * @return $this|\WP_Error
	 */
	protected function resend_notification( $id = null ) {
		if ( $id ) {
			$this->setAttribute( 'id', $id );
		}

		if ( $this->fireModelEvent( 'resending_notification' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'id_missing', 'The id is missing.' );
		}

		$resent = $this->makeRequest(
			[
				'method' => 'POST',
				'query'  => $this->query,
			],
			$this->endpoint . '/' . $this->attributes['id'] . '/resend_notification/'
		);

		if ( is_wp_error( $resent ) ) {
			return $resent;
		}

		$this->resetAttributes();

		$this->fill( $resent );

		$this->fireModelEvent( 'resent_notification' );

		return $this;
	}
}
