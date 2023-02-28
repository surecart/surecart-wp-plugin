<?php

namespace SureCartBlocks\Blocks\Dashboard\CustomerStoreLinks;

use SureCartBlocks\Blocks\BaseBlock;


/**
 * Store Links
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
	public function render( $attributes, $content, $block = null ) {

		$account     = \SureCart::account();
		$privacy_url = $account->portal_protocol->privacy_url ?? \get_privacy_policy_url();
		$terms_url   = $account->portal_protocol->terms_url ?? '';

		$output = '';

		$linkStyle = isset( $attributes['color'] ) ? 'color:' . $attributes['color'] . ';' : '';

		if ( ! empty( $terms_url ) ) {
			$output .= '<a style="' . $linkStyle . '" href="' . esc_url( $terms_url ) . '" target="_blank">' . __( 'Terms', 'surecart' ) . '</a>';
		}

		if ( ! empty( $privacy_url ) ) {
			$output .= '<a style="' . $linkStyle . '" href="' . esc_url( $privacy_url ) . '" target="_blank">' . __( 'Privacy Policy', 'surecart' ) . '</a>';
		}

		if( ! empty( $output ) ) {

			$style = 'display: inline-flex;';
			$style .= isset( $attributes['gap'] ) ? 'column-gap:' . $attributes['gap'] . ';' : '25px;';

			$output = '<div class="sc-customer-store-links" style="' . $style . '">' . $output . '</div>';
		}

		return $output;
	}
}
