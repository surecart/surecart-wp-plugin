<?php
$product      = sc_get_product();
$bundle_items = $product->initial_price->bundle_items->data ?? [];

if ( empty( $bundle_items ) ) {
	return;
}
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-bundle-items' ) ) ); ?>>
	<?php if ( ! empty( $attributes['title'] ) ) : ?>
		<div class="sc-bundle-items__title">
			<?php echo esc_html( $attributes['title'] ); ?>
		</div>
	<?php endif; ?>

	<ul class="sc-bundle-items__list">
		<?php foreach ( $bundle_items as $item ) : ?>
			<?php
			$component_product = $item->product ?? null;
			$component_name    = $component_product->name ?? '';
			$component_image   = $component_product->line_item_image ?? null;
			$item_quantity     = (int) ( $item->quantity ?? 1 );
			?>
			<li class="sc-bundle-items__item">
				<?php if ( ! empty( $component_image->src ) ) : ?>
					<img
						class="sc-bundle-items__item-image"
						src="<?php echo esc_url( $component_image->src ); ?>"
						alt="<?php echo esc_attr( $component_name ); ?>"
						loading="lazy"
					/>
				<?php else : ?>
					<div class="sc-bundle-items__item-image-placeholder"></div>
				<?php endif; ?>

				<div class="sc-bundle-items__item-info">
					<span class="sc-bundle-items__item-name">
						<?php echo esc_html( $component_name ); ?>
					</span>
					<?php if ( ! empty( $item->variant ) && ! empty( $item->variant->name ) ) : ?>
						<span class="sc-bundle-items__item-variant">
							<?php echo esc_html( $item->variant->name ); ?>
						</span>
					<?php endif; ?>
				</div>

				<?php if ( $item_quantity > 1 ) : ?>
					<span class="sc-bundle-items__item-qty">
						&times; <?php echo esc_html( $item_quantity ); ?>
					</span>
				<?php endif; ?>
			</li>
		<?php endforeach; ?>
	</ul>
</div>
