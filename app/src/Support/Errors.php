<?php

namespace CheckoutEngine\Support;

/**
 * Handles error translations from the API.
 */
class Errors {
	/**
	 * Translate Errors
	 *
	 * @param array   $response Respons from platform.
	 * @param integer $code Status code.
	 *
	 * @return \WP_Error
	 */
	public static function formatAndTranslate( $response, $code ) {
		$formatted = new \WP_Error(
			$response['code'] ?? '',
			self::translateErrorMessage( $response, $response['message'] ) ?? '',
			[
				'status'      => $code,
				'type'        => $response['type'] ?? '',
				'http_status' => $response['http_status'] ?? '',
			]
		);

		if ( ! empty( $response['validation_errors'] ) ) {
			foreach ( $response['validation_errors']  as $error ) {
				// not a validation error.
				if ( empty( $error['attribute'] ) ) {
					$formatted = new \WP_Error(
						$response['code'] ?? '',
						self::translateErrorMessage( $error, $error['message'] ) ?? '',
						[
							'status'      => $code,
							'type'        => $error['type'] ?? '',
							'http_status' => $response['http_status'] ?? '',
						]
					);

					wp_die( self::translateErrorMessage( $error, $error['message'] ) );
				}

				$formatted->add(
					$error['code'] ?? 'invalid',
					self::translateErrorMessage( $error, $error['message'] ),
					[
						'attribute' => $error['attribute'] ?? '',
						'type'      => $error['type'] ?? '',
						'options'   => $error['options'] ?? [],
					]
				);
			}
		}

		return $formatted;
	}

	/**
	 * Translate a specific error response
	 *
	 * @param array $response Error response.
	 * @return \WP_Error
	 */
	public static function translateErrorMessage( $response, $fallback = 'Error' ) {
		// translate specific error code.
		$translated = self::translateCode( $response['code'] ?? '' );
		if ( $translated ) {
			return $translated;
		}

		// translate attribute.
		$translated = self::attributeTranslation( $response['attribute'] ?? '', $response['type'] ?? '' );
		if ( $translated ) {
			return $translated;
		}

		// translate type.
		$translated = self::typeTranslation( $response['type'] || '' );
		if ( $translated ) {
			return $translated;
		}

		// fallback.
		return $fallback ?? __( 'Error', 'checkout_engine' );
	}

	/**
	 * Translate based on specific error code.
	 *
	 * @param string $code
	 * @return void
	 */
	public static function translateCode( $code = '' ) {
		if ( ! $code ) {
			return false;
		}

		// very specific.
		$code_translations = include 'Translations/codes.php';
		if ( ! empty( $code_translations[ $code ] ) ) {
			return $code_translations[ $code ];
		}

		return false;
	}

	/**
	 * Replaceable attribute translation
	 *
	 * @param string $attribute Attribute name.
	 * @param string $type Type of validation.
	 *
	 * @return string|false
	 */
	public static function attributeTranslation( $attribute, $type ) {
		// if both are empty, return.
		if ( empty( $attribute ) && empty( $type ) ) {
			return false;
		}

		$attribute_translations        = include 'Translations/attributes.php';
		$type_translations_replaceable = include 'Translations/types-replaceable.php';

		// we have an attribute.
		if ( ! empty( $attribute_translations[ $attribute ] ) ) {
			// we have a type.
			if ( ! empty( $type_translations_replaceable[ $type ] ) ) {
				return sprintf( $type_translations_replaceable[ $type ], $attribute_translations[ $attribute ] );
			}
			// translators: field name.
			return sprintf( __( '%s is invalid.', 'checkount_engine' ), $attribute_translations[ $attribute ] );
		}

		return false;
	}

	/**
	 * Translate just the type field
	 *
	 * @param string $type Type sting.
	 * @return string|false
	 */
	public static function typeTranslation( $type = '' ) {
		if ( ! $type ) {
			return false;
		}

		// we have no attribute.
		$type_translations = include 'Translations/types.php';

		if ( ! empty( $type_translations[ $type ] ) ) {
			return $type_translations[ $type ];
		}
	}
}
