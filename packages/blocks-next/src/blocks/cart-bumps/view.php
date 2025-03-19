<div
	class="sc-image-slider"
	data-wp-interactive='{ "namespace": "surecart/image-slider" }'
	data-wp-init="actions.init"
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( $slider_options ) ); ?>
>
	<div class="swiper" style="height: <?php echo esc_attr( $height ); ?>">
		<div class="swiper-wrapper" data-wp-interactive='{ "namespace": "surecart/checkout" }'>
			<template
				data-wp-each--bump="state.checkoutLineItems"
				data-wp-each-key="context.bump.id"
			>
				<div class="swiper-slide wp-block-surecart-cart-bumps__item">
					<span data-wp-text="context.bump.price.product.name"></span>
				</div>
			</template>
		</div>
	</div>
</div>