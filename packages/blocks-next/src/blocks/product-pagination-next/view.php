<?php
$arrowMap = [
	"none" => '',
	"arrow" => '→',
	"chevron" => '»',
];
$paginationArrow = $block->context['paginationArrow'] ?? '';
$displayArrow = $arrowMap[$paginationArrow] ?? '';
?>
<a
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-bind--href="context.nextPageLink"
	data-wp-on--click="surecart/product-list::actions.navigate"
	data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
	data-wp-class--disabled="!context.nextPageLink"
>
	<?php echo wp_kses_post($attributes['label'] ?? __( 'Next', 'surecart' )); ?>
	<?php if ( $displayArrow ) : ?>
	<span
		class="wp-block-product-pagination-next-arrow is-arrow-<?php echo esc_attr( $paginationArrow ); ?>"
	>
		<?php echo esc_html( $displayArrow ); ?>
	</span>
	<?php endif; ?>
</a>
