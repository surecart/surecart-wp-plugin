<?php

namespace SureCart\Models;

/**
 * Holds the data of the current account.
 */
class Brand extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'brand';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'brand';

	/**
	 * Does an update clear account cache?
	 *
	 * @var boolean
	 */
	protected $clears_account_cache = true;

	/**
	 * Set the logo attribute.
	 *
	 * @param  mixed $value Logo properties.
	 * @return void
	 */
	public function setLogoAttribute( $value ) {
		if ( empty( $value ) ) {
			$this->attributes['logo'] = '';
			return;
		}
		$this->setRelation( 'logo', $value, Media::class );
	}

	/**
	 * Set the dark logo attribute.
	 *
	 * @param  mixed $value Dark logo properties.
	 * @return void
	 */
	public function setDarkLogoAttribute( $value ) {
		if ( empty( $value ) ) {
			$this->attributes['dark_logo'] = '';
			return;
		}
		$this->setRelation( 'dark_logo', $value, Media::class );
	}

	/**
	 * Finalize the session for checkout.
	 *
	 * @return $this|\WP_Error
	 */
	protected function purgeLogo() {
		if ( $this->fireModelEvent( 'purgingLogo' ) === false ) {
			return false;
		}

		$purged = \SureCart::request(
			$this->endpoint . '/purge_logo/',
			[
				'method' => 'DELETE',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $this->getAttributes(),
				],
			]
		);

		if ( is_wp_error( $purged ) ) {
			return $purged;
		}

		$this->resetAttributes();

		$this->fill( $purged );

		$this->fireModelEvent( 'logoPurged' );

		return $this;
	}
}
