<?php
/**
 * Get the current block styles.
 *
 * @return array
 */
function sc_get_block_styles() {
	return \SureCart::block()->styles()->get();
}
