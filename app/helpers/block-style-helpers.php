<?php
/**
 * Get the current block styles.
 *
 * @return array
 */
function sc_get_block_styles( $combined = true, $block = null ) {
	return \SureCart::block()->styles()->get( $combined, $block );
}
