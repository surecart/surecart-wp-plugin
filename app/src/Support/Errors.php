<?php

namespace CheckoutEngine\Support;

use ArrayAccess;
use JsonSerializable;

/**
 * Handles error translations from the API.
 */
class Errors implements ArrayAccess {
	/**
	 * Https status code.
	 *
	 * @var integer
	 */
	protected $code;

	/**
	 * Error response.
	 *
	 * @var array
	 */
	protected $response;

	/**
	 * Stores the errors.
	 *
	 * @var array
	 */
	protected $errors;

	/**
	 * Stores the model types for translation.
	 *
	 * @var array
	 */
	protected $types = [];

	/**
	 * Holds generic error translations
	 *
	 * @var array
	 */
	protected $type_errors = [];

	/**
	 * Holds static error translations
	 *
	 * @var array
	 */
	protected $status_errors = [];

	/**
	 * Coded errors
	 *
	 * @var array
	 */
	protected $code_errors = [];

	/**
	 * Attribute translations.
	 *
	 * @var array
	 */
	protected $attributes = [];

	/**
	 * Get things going.
	 *
	 * @param array $response Error response.
	 */
	public function __construct( $response ) {
		$this->type_errors = [
			'bad_request'          => __( 'Bad request.', 'checkout_engine' ),
			'unauthorized'         => __( 'You are not allowed to do this.', 'checkout_engine' ),
			'not_found'            => __( 'Not found.', 'checkout_engine' ),
			'unprocessable_entity' => __( 'Could not complete the request. Please try again.', 'checkout_engine' ),
			'server_error'         => __( 'Something went wrong.', 'checkout_engine' ),
		];

		$this->status_errors = array_merge( [], $this->type_errors );

		$this->code_errors = [
			// translators: field name.
			'blank' => __( "%1s can't be blank.", 'checkout_engine' ),
		];

		$this->attributes = [
			'name' => __( 'Name', 'checkout_engine' ),
		];

		$response['message'] = $this->translateError( $response );

		if ( ! empty( $response['validation_errors'] ) ) {
			foreach ( $response['validation_errors'] as $key => $validation_error ) {
				$response['validation_errors'][ $key ]['message'] = $this->translateValidationError( $validation_error );
			}
		}

		$this->errors = $response;

		return $this;
	}

	/**
	 * Translate a specific error.
	 *
	 * @param array $error Error array.
	 */
	protected function translateError( $error ) {
		// give it the generic catch-all.
		$translated = __( 'Something went wrong.', 'checkout_engine' );

		// check for type error.
		if ( ! empty( $error['type'] ) && ! empty( $this->type_errors[ $error['type'] ] ) ) {
			$translated = $this->type_errors[ $error['type'] ];
		}

		// check for attribute error.
		if ( ! empty( $error['code'] ) && ! empty( $error['attribute'] ) ) {
			if ( ! empty( $this->code_errors[ $error['code'] ] ) && ! empty( $this->attributes[ $error['attribute'] ] ) ) {
				$translated = sprintf( $this->code_errors[ $error['code'] ], $this->attributes[ $error['attribute'] ] );
			}
		}

		return $translated;
	}

	/**
	 * Translate the validation error.
	 *
	 * @return void
	 */
	public function translateValidationError() {
	}

	/**
	 * Get an error attribute
	 *
	 * @return void
	 */
	public function get( $key = '' ) {
		return $key ? $this->errors[ $key ] : $this->errors;
	}

	/**
	 * Get validation errors.
	 *
	 * @return array
	 */
	public function getValidationErrors() {
		 return $this->errors['validation_errors'];
	}

	/**
	 * Get the error attribute
	 *
	 * @param string $key Attribute name.
	 *
	 * @return void
	 */
	public function __get( $key ) {
		return $key ? $this->errors[ $key ] : $this->errors;
	}

	/**
	 * Set the attribute
	 *
	 * @param string $key Attribute name.
	 * @param mixed  $value Value of attribute.
	 *
	 * @return void
	 */
	public function __set( $key, $value ) {
		$this->errors[ $key ] = $value;
	}

	/**
	 * Determine if the given attribute exists.
	 *
	 * @param  mixed $offset Name.
	 * @return bool
	 */
	public function offsetExists( $offset ) {
		return ! is_null( $this->errors[ $offset ] );
	}

	/**
	 * Get the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @return mixed
	 */
	public function offsetGet( $offset ) {
		return $this->errors[ $offset ];
	}

	/**
	 * Set the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @param  mixed $value Value.
	 * @return void
	 */
	public function offsetSet( $offset, $value ) {
		$this->errors[ $offset ] = $value;
	}

	/**
	 * Unset the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @return void
	 */
	public function offsetUnset( $offset ) {
		unset( $this->errors[ $offset ] );
	}

	/**
	 * Determine if an attribute or relation exists on the model.
	 *
	 * @param  string $key Name.
	 * @return bool
	 */
	public function __isset( $key ) {
		return $this->errors[ $key ];
	}

	/**
	 * Unset an attribute on the model.
	 *
	 * @param  string $key Name.
	 * @return void
	 */
	public function __unset( $key ) {
		$this->offsetUnset( $key );
	}

	/**
	 * Serialize to json.
	 *
	 * @return Array
	 */
	public function jsonSerialize() {
		return $this->errors;
	}
}
