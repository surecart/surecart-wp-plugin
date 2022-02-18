
<div class="wrap">
	<?php \CheckoutEngine::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Upgrade Groups', 'checkout_engine' ),
			'new_link' => \CheckoutEngine::getUrl()->edit( 'product_group' ),
		]
	); ?>

	<?php $table->display(); ?>
</div>

