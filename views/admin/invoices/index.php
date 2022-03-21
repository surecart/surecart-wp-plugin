
<div class="wrap">
	<?php \CheckoutEngine::render( 'layouts/partials/admin-index-styles' ); ?>
	<?php
	\CheckoutEngine::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Invoices', 'surecart' ),
		]
	);
	?>

	<?php $table->display(); ?>
</div>

