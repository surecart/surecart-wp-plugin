<?php
/**
 * Get the current block styles.
 *
 * @param bool   $combine Whether to combine the styles or not.
 * @param object $block The block object.
 * @return array
 */
function sc_get_block_styles( $combine = true, $block = null ) {
	return \SureCart::block()->styles()->get( $combine, $block );
}
