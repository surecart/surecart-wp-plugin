<?php
// phpcs:ignoreFile
if ( ! function_exists( 'ray' ) ) {
	/**
	 * Just in case Ray is not installed
	 * but forgot to remove it.
	 */
	class Checkout_Engine_Ray_Dummy_Class {
		function __call( $fun_name, $arguments ) {
			return new Checkout_Engine_Ray_Dummy_Class();
		}

		static function ray( ...$args ) {
			return new Checkout_Engine_Ray_Dummy_Class();
		}

		function __get( $propertyName ) {
			return null;
		}

		function __set( $property, $value ) {
		}
	}

	function ray( ...$args ) {
		return Checkout_Engine_Ray_Dummy_Class::ray( ...$args );
	}
}

