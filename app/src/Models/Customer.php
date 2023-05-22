<?php

namespace SureCart\Models;

use SureCart\Models\Traits\SyncsCustomer;

/**
 * Price model
 */
class Customer extends Model {
	use SyncsCustomer;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'customers';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'customer';

	/**
	 * Create a new model
	 *
	 * @param array   $attributes Attributes to create.
	 * @param boolean $create_user Whether to create a corresponding WordPress user.
	 *
	 * @return $this|\WP_Error|false
	 */
	protected function create( $attributes = [], $create_user = true ) {
		parent::create( $attributes );

		// maybe create a WordPress user.
		if ( $create_user ) {
			$user = User::create(
				[
					'user_name'  => $this->attributes['name'] ?? null,
					'user_email' => $this->attributes['email'],
				]
			);

			// handle error creating user.
			if ( is_wp_error( $user ) ) {
				return $user;
			}

			$linked = $user->setCustomerId( $this->attributes['id'], $this->live_mode ? 'live' : 'test' );

			if ( is_wp_error( $linked ) ) {
				return $linked;
			}
		}

		return $this;
	}

	/**
	 * Delete the model.
	 *
	 * @param int $id Customer ID.
	 *
	 * @return $this|\WP_Error|false
	 */
	protected function delete( $id = 0 ) {
		$customer = self::find( $id );
		$deleted  = parent::delete( $id );

		if ( ! is_wp_error( $deleted ) ) {
			$user = User::findByCustomerId( $id );

			if ( $user ) {
				if ( is_wp_error( $customer ) ) {
					return $customer;
				}

				$user->removeCustomerId( $customer->live_mode ? 'live' : 'test' );
			}
		}

		return $deleted;
	}

	/**
	 * Expose media for a customer
	 *
	 * @param string $media_id The media id.
	 *
	 * @return \SureCart\Models\Media|false;
	 */
	protected function exposeMedia( $media_id ) {
		if ( empty( $this->attributes['id'] ) || empty( $media_id ) ) {
			return false;
		}

		if ( $this->fireModelEvent( 'exposing_media' ) === false ) {
			return false;
		}

		$media = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/expose/' . $media_id,
			[
				'method' => 'GET',
				'query'  => $this->query,
			]
		);

		if ( $this->isError( $media ) ) {
			return $media;
		}

		$this->fireModelEvent( 'exposed_media' );

		return new Media( $media );
	}

	/**
	 * Get a customer by their email address
	 *
	 * @param string $email Email address.
	 * @return this
	 */
	protected function byEmail( $email ) {
		return $this->where(
			[
				'email' => $email,
			]
		)->first();
	}

	/**
	 * Get the customer's user.
	 *
	 * @return string|null
	 */
	public function getUser() {
		// find the user by customer id.
		$user = User::findByCustomerId( $this->id );
		if ( ! empty( $user ) ) {
			return $user;
		}

		// we are not syncing the customer.
		if ( ! $this->shouldSyncCustomer() ) {
			return null;
		}

		// check if the user exists by email.
		$wp_user = User::getUserBy( 'email', $this->email );
		if ( ! empty( $wp_user ) ) {
			// return early if the user already has a customer id.
			if ( $wp_user->isCustomer() ) {
				return null;
			}

			// associate the user with the customer.
			$wp_user->setCustomerId( $this->id, $this->live_mode ? 'live' : 'test' );
			// return the user.
			return $wp_user;
		}

		// get the username from the name or email.
		$username = $this->name ?? '';
		if ( empty( $username ) ) {
			$username = $this->email;
		}

		// create the user.
		$wp_user = User::create(
			[
				'user_name'  => sanitize_user( $username, true ),
				'user_email' => $this->email,
			]
		);

		// associate the user with the customer.
		$wp_user->setCustomerId( $this->id, $this->live_mode ? 'live' : 'test' );

		return $wp_user;
	}

	/**
	 * Maybe also return the user when the id is set.
	 *
	 * @param string $value The user id.
	 * @return void
	 */
	public function setIdAttribute( $value ) {
		$this->attributes['id'] = $value;
		if ( ! empty( $this->query['expand'] ) && in_array( 'user', $this->query['expand'] ) ) {
			$this->attributes['user'] = $this->getUser();
		}
	}
}
