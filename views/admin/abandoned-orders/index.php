<div class="wrap">
	<?php \SureCart::render(
		'layouts/partials/admin-index-header',
		surecart
		[ 'title' => __( 'Abandoned Orders', 'surecart' ), ]
	); ?>

	<?php $table->display(); ?>
</div>
