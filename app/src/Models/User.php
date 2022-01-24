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
	 * Holds the cutomser
	 *
	 * @var \CheckoutEngine\Models\Customer;
	 */
	protected $customer;

	/**
	 * Stores the customer id key.
	 *
	 * @var string
	 */
	protected $customer_id_key = 'ce_customer_id';

	/**
	 * Get the customer meta key.
	 *
	 * @return string
	 */
	protected function getCustomerMetaKey() {
		return $this->customer_id_key;
	}

	/**
	 * Get the user's customer id.
	 *
	 * @return int|null
	 */
	protected function customerId() {
		if ( empty( $this->user->ID ) ) {
			return '';
		}
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
	 * @return CheckoutEngine\Models\Order[];
	 */
	protected function orders() {
		return Order::where( [ 'customer_ids' => [ $this->customerId() ] ] );
	}

	/**
	 * Login the user.
	 *
	 * @return void
	 */
	protected function login() {
		if ( empty( $this->user->ID ) ) {
			return new \Error( 'not_found', esc_html__( 'This user could not be found.', 'checkout_engine' ) );
		}

		wp_clear_auth_cookie();
		wp_set_current_user( $this->user->ID );
		wp_set_auth_cookie( $this->user->ID );
	}

	/**
	 * Create a new user and return this model context
	 * If the user already exists, just set the customer and role in that case.
	 */
	protected function create( $args ) {
		$args = wp_parse_args(
			$args,
			[
				'user_name'     => '',
				'user_email'    => '',
				'user_password' => '',
			]
		);

		$user_id       = username_exists( $args['user_name'] );
		$user_password = trim( $args['user_password'] );
		$user_created  = false;

		if ( ! $user_id && empty( $user_password ) ) {
			$user_password = wp_generate_password( 12, false );
			$user_id       = wp_create_user( $args['user_name'], $user_password, $args['user_email'] );
			update_user_meta( $user_id, 'default_password_nag', true );
			$user_created = true;
		} elseif ( ! $user_id ) {
			// Password has been provided.
			$user_id      = wp_create_user( $args['user_name'], $user_password, $args['user_email'] );
			$user_created = true;
		}

		$user = new \WP_User( $user_id );
		$user->add_role( 'ce-customer' );

		if ( $user_created ) {
			wp_update_user( $user );
		}

		return $this->find( $user->ID );
	}

	/**
	 * Retrieve user info by a given field
	 *
	 * @param string     $field The field to retrieve the user with. id | ID | slug | email | login.
	 * @param int|string $value A value for $field. A user ID, slug, email address, or login name.
	 * @return this|false This object on success, false on failure.
	 */
	protected function getUserBy( $field, $value ) {
		$this->user = get_user_by( $field, $value );
		return $this->user ? $this : false;
	}

	/**
	 * Get the customer from the user.
	 *
	 * @return \CheckoutEngine\Models\Customer|false
	 */
	protected function customer() {
		$id = $this->customerId();
		if ( ! $id ) {
			return false;
		}
		return Customer::find( $this->customerId() );
	}

	/**
	 * Create the customer by email.
	 *
	 * @return void
	 */
	public function createCustomerByEmail() {
		$customer = Customer::byEmail( $this->user->user_email );
		if ( $customer ) {
			$this->customer = $this->setCustomerId( $customer->id );
		}
		return $this;
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
		$users = new \WP_User_Query(
			array(
				'meta_key'   => $this->customer_id_key,
				'meta_value' => $id,
			)
		);
		if ( empty( $users->results ) ) {
			return false;
		}

		$this->user = $users->results[0];
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
