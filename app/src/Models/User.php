<?php
namespace CheckoutEngine\Models;

use ArrayAccess;
use JsonSerializable;

/**
 * User class.
 */
class User implements ArrayAccess, JsonSerializable {
	/**
	 * Holds the user.
	 *
	 * @var \WP_User|null;
	 */
	protected $user;

	/**
	 * Stores the customer id key.
	 *
	 * @var string
	 */
	protected $customer_id_key = 'ce_customer_id';

	/**
	 * Get the user's customer id.
	 *
	 * @return int|null
	 */
	protected function customerId() {
		return get_user_meta( $this->user->ID, $this->customer_id_key, true );
	}

	/**
	 * Set the customer id in the user meta.
	 *
	 * @param string $id Customer id.
	 * @return int|bool
	 */
	protected function setCustomerId( $id ) {
		return update_user_meta( $this->user->ID, $this->customer_id_key, $id );
	}

	/**
	 * Disallow overriding the constructor in child classes and make the code safe that way.
	 */
	final public function __construct() {
	}

	/**
	 * Get a user's subscriptions
	 *
	 * @return mixed
	 */
	protected function subscriptions() {
		return Subscription::where( [ 'customer_ids' => [ $this->customerId() ] ] );
	}

	/**
	 * Get a users orders
	 *
	 * @param array $query Query args.
	 * @return CheckoutEngine\Models\CheckoutSession[];
	 */
	protected function orders() {
		return CheckoutSession::where( [ 'customer_ids' => [ $this->customerId() ] ] );
	}

	/**
	 * Get the customer from the user.
	 *
	 * @return \CheckoutEngine\Models\Customer|false
	 */
	protected function customer() {
		$id = $this->customerId();
		if ( $id ) {
			return Customer::find( $this->customerId() );
		} else {
			if ( $this->user->ID ) {
				$customer = Customer::byEmail( $this->user->user_email );
				if ( $customer ) {
					$this->setCustomerId( $customer->id );
					return $customer;
				}
			}
			return false;
		}
	}

	/**
	 * Get the current user
	 *
	 * @return $this
	 */
	protected function current() {
		$this->user = wp_get_current_user();
		return $this;
	}

	/**
	 * Find the user.
	 *
	 * @param integer $id ID of the WordPress user.
	 * @return $this
	 */
	protected function find( $id ) {
		$this->user = get_user_by( 'id', $id );
		return $this;
	}

	/**
	 * Find the user by customer id.
	 *
	 * @param string $id Customer id string.
	 * @return $this
	 */
	protected function findByCustomerId( $id ) {
		$users = get_users(
			array(
				'meta_key'   => $this->customer_id_key,
				'meta_value' => $id,
			)
		);
		if ( ! empty( $users ) ) {
			$this->user = $users[0];
		}
		return $this;
	}

	/**
	 * Get a specific attribute
	 *
	 * @param string $key Attribute name.
	 *
	 * @return mixed
	 */
	public function getAttribute( $key ) {
		$attribute = null;

		if ( $this->hasAttribute( $key ) ) {
			$attribute = $this->user->$key;
		}

		return $attribute;
	}

	/**
	 * Sets a user attribute
	 * Optionally calls a mutator based on set{Attribute}Attribute
	 *
	 * @param string $key Attribute key.
	 * @param mixed  $value Attribute value.
	 *
	 * @return mixed|void
	 */
	public function setAttribute( $key, $value ) {
		$this->user->$key = $value;
	}

	/**
	 * Does it have the attribute
	 *
	 * @param string $key Attribute key.
	 *
	 * @return boolean
	 */
	public function hasAttribute( $key ) {
		return $this->user->$key;
	}

	/**
	 * Serialize to json.
	 *
	 * @return Array
	 */
	public function jsonSerialize() {
		return $this->user->to_array();
	}

	/**
	 * Get the attribute
	 *
	 * @param string $key Attribute name.
	 *
	 * @return mixed
	 */
	public function __get( $key ) {
		return $this->getAttribute( $key );
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
		$this->setAttribute( $key, $value );
	}

	/**
	 * Determine if the given attribute exists.
	 *
	 * @param  mixed $offset Name.
	 * @return bool
	 */
	public function offsetExists( $offset ) {
		return ! is_null( $this->getAttribute( $offset ) );
	}

	/**
	 * Get the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @return mixed
	 */
	public function offsetGet( $offset ) {
		return $this->getAttribute( $offset );
	}

	/**
	 * Set the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @param  mixed $value Value.
	 * @return void
	 */
	public function offsetSet( $offset, $value ) {
		$this->setAttribute( $offset, $value );
	}

	/**
	 * Unset the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @return void
	 */
	public function offsetUnset( $offset ) {
		$this->user->$offset = null;
	}

	/**
	 * Determine if an attribute or relation exists on the model.
	 *
	 * @param  string $key Name.
	 * @return bool
	 */
	public function __isset( $key ) {
		return $this->offsetExists( $key );
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
	 * Forward call to method
	 *
	 * @param string $method Method to call.
	 * @param mixed  $params Method params.
	 */
	public function __call( $method, $params ) {
		return call_user_func_array( [ $this, $method ], $params );
	}

	/**
	 * Static Facade Accessor
	 *
	 * @param string $method Method to call.
	 * @param mixed  $params Method params.
	 *
	 * @return mixed
	 */
	public static function __callStatic( $method, $params ) {
		return call_user_func_array( [ new static(), $method ], $params );
	}
}
