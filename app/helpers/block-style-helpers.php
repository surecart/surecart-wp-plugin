<?php
/**
 * Get the current block styles.
 *
 * @return array
 */
function sc_get_block_styles() {
	return \SureCart::block()->styles()->get();
}

/**
 * Get the CSS variable for Block Gap, since the gap styles are not being added in the sc_get_block_styles.
 *
 * @param string $block_gap_attribute Current value of Block Gap attribute.
 * @return array
 */
function sc_get_block_gap_css_var( $block_gap_attribute ) {
	return \SureCart::block()->styles()->getBlockGapPresetCssVar( $block_gap_attribute );
}
