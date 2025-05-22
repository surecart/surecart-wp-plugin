<?php

namespace SureCart\Models\Traits;

/**
 * If the model has an attached customer.
 */
trait CanDuplicate {
	/**
	 * Duplicate the model.
	 *
	 * @param string $id The ID of the model to duplicate.
	 * @return $this|\WP_Error
	 */
	protected function duplicate( $id = '' ) {
		if ( $id ) {
			$this->attributes['id'] = $id;
		}

		if ( $this->fireModelEvent( 'duplicating' ) === false ) {
			return false;
		}

		if ( empty( $this->attributes['id'] ) ) {
			return new \WP_Error( 'not_saved', 'Please create the model first.' );
		}

		$duplicated = \SureCart::request(
			$this->endpoint . '/' . $this->attributes['id'] . '/duplicate/',
			[
				'method' => 'POST',
				'query'  => $this->query,
			]
		);

		if ( is_wp_error( $duplicated ) ) {
			return $duplicated;
		}

		$current_post_content = $this->post->post_content ?? '';

		$this->resetAttributes();

		$this->fill( $duplicated );

		$this->fireModelEvent( 'duplicated' );

		// sync with the post.
		$post = $this->sync();

		if ( is_wp_error( $post ) ) {
			return $post;
		}

		wp_update_post(
			array(
				'ID'           => $this->post->ID,
				'post_content' => $current_post_content,
			)
		); // update the post content.

		return $this;
	}
}
