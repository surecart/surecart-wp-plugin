
<div class="wrap">
	<?php \CheckoutEngine::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Orders', 'checkout_engine' ),
			'new_link' => \CheckoutEngine::getUrl()->edit( 'order' ),
		]
	); ?>

	<?php $table->display(); ?>
</div>

