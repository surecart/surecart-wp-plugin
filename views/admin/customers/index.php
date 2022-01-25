<div class="wrap">
	<?php \CheckoutEngine::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Customers', 'checkout_engine' ),
			'new_link' => \CheckoutEngine::getUrl()->edit( 'customers' ),
		]
	); ?>

	<?php $table->display(); ?>
</div>


