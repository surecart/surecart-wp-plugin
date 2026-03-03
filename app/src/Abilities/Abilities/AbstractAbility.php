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
