<?php

namespace SureCartBlocks\Blocks\CheckoutForm;

use SureCartBlocks\Blocks\BaseBlock;

/**
 * Logout Button Block.
 */
class Block extends BaseBlock {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		static $seen_forms = array();

		if ( empty( $attributes['id'] ) ) {
			return '';
		}

		$form = get_post( $attributes['id'] );
		if ( ! $form || 'sc_form' !== $form->post_type ) {
			return '';
		}

		if ( isset( $seen_forms[ $attributes['id'] ] ) ) {
			// WP_DEBUG_DISPLAY must only be honored when WP_DEBUG. This precedent
			// is set in `wp_debug_mode()`.
			$is_debug = defined( 'WP_DEBUG' ) && WP_DEBUG &&
			defined( 'WP_DEBUG_DISPLAY' ) && WP_DEBUG_DISPLAY;

			return $is_debug ?
			// translators: Visible only in the front end, this warning takes the place of a faulty block.
			__( '[block rendering halted]', 'surecart' ) :
			'';
		}

		if ( 'publish' !== $form->post_status || ! empty( $form->post_password ) ) {
			return '';
		}

		$seen_forms[ $attributes['id'] ] = true;

		global $sc_form_id;
		$sc_form_id         = $attributes['id'];
		$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => $attributes['textalign'] ?? '' ] );
		
		if ( class_exists( '\UAGB_Post_Assets' ) ) {
			// If Spectra Blocks are present in the form, enqueue the assets.
			$post_assets_instance = new \UAGB_Post_Assets( $sc_form_id );
			$post_assets_instance->enqueue_scripts();
		}
		
		$result             = do_blocks( $form->post_content );
		unset( $seen_forms[ $attributes['id'] ] );
		return '<div ' . $wrapper_attributes . '>' . $result . '</div>';
	}
}
