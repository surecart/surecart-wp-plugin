<div class="wrap">
	<?php \CheckoutEngine::render( 'layouts/partials/admin-index-styles' ); ?>
	<?php
	\CheckoutEngine::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Customers', 'surecart' ),
			'new_link' => \CheckoutEngine::getUrl()->edit( 'customers' ),
		]
	);
	?>

	<?php $table->display(); ?>
</div>


