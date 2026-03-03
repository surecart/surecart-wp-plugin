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
	 * @return array
	 */
	abstract public function execute( array $input ): array;

	/**
	 * Check if the current user has permission to execute this ability.
	 *
	 * @return bool
	 */
	public function check_permission(): bool {
		return current_user_can( 'edit_sc_products' );
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
			'category'            => 'surecart/ecommerce',
			'permission_callback' => array( $this, 'check_permission' ),
			'input_schema'        => $this->get_input_schema(),
			'output_schema'       => $this->get_output_schema(),
			'execute_callback'    => array( $this, 'execute' ),
			'meta'                => array(
				'mcp' => array(
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
	 * Return an error response.
	 *
	 * @param string $message The error message.
	 *
	 * @return array
	 */
	protected function error( string $message ): array {
		return array(
			'success' => false,
			'error'   => $message,
		);
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
	 * Build a descriptive error message from a WP_Error, appending the HTTP status code when available.
	 *
	 * @param \WP_Error $error The WP_Error instance.
	 *
	 * @return string
	 */
	protected function wp_error_to_message( \WP_Error $error ): string {
		$message = $error->get_error_message();
		$data    = $error->get_error_data();
		if ( ! empty( $data['status'] ) ) {
			$message .= ' (HTTP ' . absint( $data['status'] ) . ')';
		}
		return $message;
	}

	/**
	 * Validate and normalize stats query args from ability input.
	 *
	 * Accepts YYYY-MM-DD date strings and converts them to Unix timestamps
	 * as required by the SureCart statistics API.
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
			return (array) $model->jsonSerialize();
		}

		if ( is_object( $model ) ) {
			return (array) $model;
		}

		return array();
	}
}
