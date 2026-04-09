<?php

namespace SureCart\Abilities\Abilities;

/**
 * Base class for all SureCart abilities.
 */
abstract class AbstractAbility {

	/**
	 * Get the ability name (e.g., 'surecart/list-products').
	 *
	 * @return string
	 */
	abstract public function get_name(): string;

	/**
	 * Get the ability label.
	 *
	 * @return string
	 */
	abstract public function get_label(): string;

	/**
	 * Get the ability description.
	 *
	 * @return string
	 */
	abstract public function get_description(): string;

	/**
	 * Get the ability annotations.
	 *
	 * Returns an array with three boolean keys:
	 * - 'readonly'    — true if the ability only reads data (maps to GET).
	 * - 'destructive' — true if the ability deletes or irreversibly modifies data.
	 * - 'idempotent'  — true if calling multiple times produces the same result.
	 *
	 * @return array{readonly: bool, destructive: bool, idempotent: bool}
	 */
	abstract public function get_annotations(): array;

	/**
	 * Get AI-facing instructions for when and how to use this ability.
	 *
	 * Override in subclasses to provide guidance on edge cases,
	 * confirmation requirements, and usage patterns.
	 *
	 * @return string
	 */
	public function get_instructions(): string {
		return '';
	}

	/**
	 * Get the JSON Schema for the input.
	 *
	 * @return array
	 */
	abstract public function get_input_schema(): array;

	/**
	 * Get the JSON Schema for the output.
	 *
	 * @return array
	 */
	abstract public function get_output_schema(): array;

	/**
	 * Execute the ability.
	 *
	 * @param array $input The input data.
	 *
	 * @return array|\WP_Error The result array on success, or WP_Error on failure.
	 */
	abstract public function execute( array $input );

	/**
	 * Check if the current user has permission to execute this ability.
	 *
	 * @return bool
	 */
	public function check_permission(): bool {
		return false;
	}

	/**
	 * Get the full configuration array for wp_register_ability().
	 *
	 * @return array
	 */
	public function get_config(): array {
		return array(
			'label'               => $this->get_label(),
			'description'         => $this->get_description(),
			'category'            => 'surecart-ecommerce',
			'permission_callback' => array( $this, 'check_permission' ),
			'input_schema'        => $this->get_input_schema(),
			'output_schema'       => $this->get_output_schema(),
			'execute_callback'    => function ( array $input ) {
				$result = $this->execute( $input );
				return is_wp_error( $result ) ? $this->extract_detailed_error( $result ) : $result;
			},
			'meta'                => array(
				'show_in_rest' => true,
				'annotations'  => $this->get_annotations(),
				'instructions' => $this->get_instructions(),
				'mcp'          => array(
					'public' => true,
				),
			),
		);
	}

	/**
	 * Return a success response.
	 *
	 * @param array $data The response data.
	 *
	 * @return array
	 */
	protected function success( array $data = array() ): array {
		return array_merge( array( 'success' => true ), $data );
	}

	/**
	 * Return a WP_Error for a validation or logic error.
	 *
	 * @param string $code    The error code.
	 * @param string $message The error message.
	 *
	 * @return \WP_Error
	 */
	protected function error( string $code, string $message ): \WP_Error {
		return new \WP_Error( $code, $message );
	}

	/**
	 * Extract a detailed error message from a WP_Error, including validation errors.
	 *
	 * The SureCart API often returns a generic top-level message (e.g. "There were some
	 * validation errors") with field-level details in additional error entries. This method
	 * combines all error messages into a single, actionable WP_Error.
	 *
	 * @param \WP_Error $wp_error The WP_Error to process.
	 *
	 * @return \WP_Error A WP_Error with a detailed, combined message.
	 */
	private function extract_detailed_error( \WP_Error $wp_error ): \WP_Error {
		$messages = $wp_error->get_error_messages();

		// If there's only one message, return as-is.
		if ( count( $messages ) <= 1 ) {
			return $wp_error;
		}

		// Combine all messages: skip the generic first message if there are field-level details.
		// Deduplicate to avoid repeated messages (e.g. "Amount is invalid. Amount is invalid.").
		$detail_messages = array_unique( array_slice( $messages, 1 ) );
		$combined        = implode( ' ', $detail_messages );

		return new \WP_Error(
			$wp_error->get_error_code(),
			$combined,
			$wp_error->get_error_data()
		);
	}

	/**
	 * Normalize ability input that may be a JSON string or an array (e.g. from form fields).
	 *
	 * @param mixed $value Raw input.
	 *
	 * @return array|null The decoded or original array, or null if not a valid array.
	 */
	protected function parse_json_or_array( $value ): ?array {
		if ( is_string( $value ) ) {
			$value = json_decode( $value, true );
		}
		return is_array( $value ) ? $value : null;
	}

	/**
	 * Validate a date string is in YYYY-MM-DD format.
	 *
	 * @param string $date The date string to validate.
	 *
	 * @return bool
	 */
	protected function is_valid_date( string $date ): bool {
		$d = \DateTime::createFromFormat( 'Y-m-d', $date );
		return $d && $d->format( 'Y-m-d' ) === $date;
	}

	/**
	 * Validate and normalize stats query args from ability input.
	 *
	 * Accepts optional YYYY-MM-DD date strings and passes them directly
	 * to the SureCart statistics API.
	 *
	 * @param array $input The raw ability input.
	 *
	 * @return array|\WP_Error Normalized args array, or WP_Error on validation failure.
	 */
	protected function resolve_stats_args( array $input ) {
		$allowed_intervals = array( 'hour', 'day', 'week', 'month', 'year' );
		$interval          = sanitize_text_field( $input['interval'] ?? 'day' );
		if ( ! in_array( $interval, $allowed_intervals, true ) ) {
			return new \WP_Error(
				'invalid_interval',
				/* translators: %s: comma-separated list of valid interval values */
				sprintf( __( 'Invalid interval. Allowed values: %s', 'surecart' ), implode( ', ', $allowed_intervals ) )
			);
		}

		$args = array( 'interval' => $interval );

		if ( ! empty( $input['start_date'] ) ) {
			$start_date = sanitize_text_field( $input['start_date'] );
			if ( ! $this->is_valid_date( $start_date ) ) {
				return new \WP_Error( 'invalid_date', __( 'start_date must be in YYYY-MM-DD format.', 'surecart' ) );
			}
			$args['start_at'] = $start_date;
		}

		if ( ! empty( $input['end_date'] ) ) {
			$end_date = sanitize_text_field( $input['end_date'] );
			if ( ! $this->is_valid_date( $end_date ) ) {
				return new \WP_Error( 'invalid_date', __( 'end_date must be in YYYY-MM-DD format.', 'surecart' ) );
			}
			$args['end_at'] = $end_date;
		}

		return $args;
	}

	/**
	 * Convert a model object to an array, handling nested objects.
	 *
	 * @param mixed $model The model or data to convert.
	 *
	 * @return array
	 */
	protected function model_to_array( $model ): array {
		if ( is_array( $model ) ) {
			return $model;
		}

		if ( $model instanceof \JsonSerializable ) {
			$data = $model->jsonSerialize();
			return is_array( $data ) ? $data : array();
		}

		if ( is_object( $model ) ) {
			return (array) $model;
		}

		return array();
	}
}
