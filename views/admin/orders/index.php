
<div class="wrap">
	<?php \CheckoutEngine::render( 'layouts/partials/admin-index-styles' ); ?>
	<?php
	\CheckoutEngine::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Orders', 'checkout_engine' ),
		]
	);
	?>

	<?php $table->display(); ?>
</div>

