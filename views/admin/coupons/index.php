<div class="wrap">
	<?php \CheckoutEngine::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Coupons', 'surecart' ),
			'new_link' => \CheckoutEngine::getUrl()->edit( 'coupon' ),
		]
	); ?>

	<?php $table->display(); ?>
</div>
