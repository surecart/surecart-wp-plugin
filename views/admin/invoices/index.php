
<div class="wrap">
	<?php \CheckoutEngine::render( 'layouts/partials/admin-index-styles' ); ?>
	<?php
	\CheckoutEngine::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Invoices', 'checkout_engine' ),
		]
	);
	?>

	<?php $table->display(); ?>
</div>

