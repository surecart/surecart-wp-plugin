<?php
$product = sc_get_product();
global $content_width;
$template_id    = $product->template_part_id ?? 'surecart/surecart//product-info';
$block_template = get_block_template( $template_id, 'wp_template_part' );
if ( empty( $block_template ) ) {
	$block_template = get_block_template( 'surecart/surecart//product-info', 'wp_template_part' );
}
$content = surecart_get_the_block_template_html( $block_template->content ?? '' );
echo '<style>
.sc-template-wrapper,
.sc-template-container {
	width: 100%;
}
.sc-template-wrapper .sc-template-container {
	max-width: var(--wp--style--global--wide-size, ' . (int) ( $content_width ?? 1170 ) . 'px) !important;
	margin-left: auto;
	margin-right: auto;
}
</style>';
get_header();
?>
<div class="wp-block-group is-layout-constrained sc-template-wrapper" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)">
	<div class="wp-block-group alignwide sc-template-container">
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput ?>
	</div>
</div>
<?php
get_footer();
