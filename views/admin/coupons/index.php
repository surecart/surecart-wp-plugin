<div class="wrap">
	<?php \CheckoutEngine::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Coupons', 'checkout_engine' ),
			'new_link' => \CheckoutEngine::getUrl()->edit( 'coupon' ),
		]
	); ?>

	<?php $table->display(); ?>
</div>
