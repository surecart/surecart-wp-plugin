<div class="wrap">
	<?php \CheckoutEngine::render(
		'layouts/partials/admin-index-header',
		surecart
		[ 'title' => __( 'Abandoned Orders', 'surecart' ), ]
	); ?>

	<?php $table->display(); ?>
</div>
