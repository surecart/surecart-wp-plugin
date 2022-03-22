<?php
// phpcs:ignoreFile
if ( ! function_exists( 'ray' ) ) {
	/**
	 * Just in case Ray is not installed
	 * but forgot to remove it.
	 */
	class SURECART_Ray_Dummy_Class {
		function __call( $fun_name, $arguments ) {
			return new SURECART_Ray_Dummy_Class();
		}

		static function ray( ...$args ) {
			return new SURECART_Ray_Dummy_Class();
		}

		function __get( $propertyName ) {
			return null;
		}

		function __set( $property, $value ) {
		}
	}

	function ray( ...$args ) {
		return SURECART_Ray_Dummy_Class::ray( ...$args );
	}
}

