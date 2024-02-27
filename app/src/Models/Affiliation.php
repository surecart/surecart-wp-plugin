<?php

namespace SureCart\Models;

/**
 * Holds the data of the current Affiliation.
 */
class Affiliation extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'affiliations';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'affiliation';

	/**
	 * Activate an affiliation
	 *
	 * @param string $id Affiliation ID.
	 *
	 * @return $this|\WP_Error
	 */
	public function activate( $id = null ) {
		if ( $id ) {
			$this->setAttribute( 'id', $id );
		}

		if ( $this->fireModelEvent( 'activating' ) === false ) {
			return $this;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the affiliation.' );
		}

		$activated = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/activate',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
			]
		);

		if ( is_wp_error( $activated ) ) {
			return $activated;
		}

		$this->resetAttributes();
		$this->fill( $activated );
		$this->fireModelEvent( 'activated' );

		return $this;
	}

	/**
	 * Deactivate an affiliation
	 *
	 * @param string $id Affiliation ID.
	 *
	 * @return $this|\WP_Error
	 */
	public function deactivate( $id = null ) {
		if ( $id ) {
			$this->setAttribute( 'id', $id );
		}

		if ( $this->fireModelEvent( 'deactivating' ) === false ) {
			return $this;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the affiliation.' );
		}

		$deactivated = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/deactivate',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
			]
		);

		if ( is_wp_error( $deactivated ) ) {
			return $deactivated;
		}

		$this->resetAttributes();
		$this->fill( $deactivated );
		$this->fireModelEvent( 'deactivated' );

		return $this;
	}

	/**
	 * Set the clicks attribute
	 *
	 * @param object $value Array of click objects
	 *
	 * @return void
	 */
	public function setClicksAttribute( $value ) {
		$this->setCollection( 'clicks', $value, Click::class );
	}

	/**
	 * Set the referrals attribute
	 *
	 * @param object $value Array of referral objects
	 *
	 * @return void
	 */
	public function setReferralsAttribute( $value ) {
		$this->setCollection( 'referrals', $value, Referral::class );
	}

	/**
	 * Set the payouts attribute
	 *
	 * @param object $value Array of payout objects
	 *
	 * @return void
	 */
	public function setPayoutsAttribute( $value ) {
		$this->setCollection( 'payouts', $value, Payout::class );
	}
}
