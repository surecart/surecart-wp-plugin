<div class="wrap">
	<?php \SureCart::render(
		'layouts/partials/admin-index-header',
		[ 'title' => __( 'Abandoned Orders', 'surecart' ), ]
	); ?>

	<?php $table->display(); ?>
</div>
