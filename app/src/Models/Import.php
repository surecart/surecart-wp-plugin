<?php

namespace SureCart\Models;

/**
 * Import model
 */
class Import extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'imports';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'import';

	/**
	 * Queue a new import.
	 *
	 * @param string $type The type of import.
	 * @param array  $data The data for the import.
	 *
	 * @return $this|\WP_Error
	 */
	protected function queue( $type, $data = [] ) {
		$this->endpoint = $this->endpoint . '/' . $type;

		if ( ! is_array( $data ) ) {
			return new \WP_Error( 'invalid_data', __( 'Data must be an array.', 'surecart' ) );
		}

		foreach ( $data as $key => $item ) {
			if ( empty( $item['content'] ) ) {
				continue;
			}

			$pattern_id = $this->addPattern( $item );
			if ( is_wp_error( $pattern_id ) ) {
				continue;
			}

			$data[ $key ]['metadata']['sc_initial_sync_pattern'] = $pattern_id;
			unset( $item['content'] );
		}

		$created = parent::create( [ 'data' => $data ] );

		if ( is_wp_error( $created ) ) {
			return $created;
		}

		return $created;
	}

	/**
	 * Add a pattern to the database.
	 *
	 * @param array $item The item.
	 *
	 * @return int|\WP_Error
	 */
	protected function addPattern( $item ) {
		$pattern_id = wp_insert_post(
			array(
				// translators: %s is the product name.
				'post_title'     => sprintf( __( '%s Content', 'surecart' ), $item['name'] ),
				'post_content'   => $item['content'],
				'post_status'    => 'publish',
				'comment_status' => 'closed',
				'ping_status'    => 'closed',
				'post_type'      => 'wp_block',
				'meta_input'     => [
					'wp_pattern_sync_status' => 'unsynced',
				],
			)
		);

		if ( is_wp_error( $pattern_id ) ) {
			error_log( 'Error adding pattern for sync ' . $item['name'] . ': ' . $pattern_id->get_error_message() );
		}

		return $pattern_id;
	}
}
