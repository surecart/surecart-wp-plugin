<div class="wrap">
	<?php \SureCart::render(
		'layouts/partials/admin-index-header',
		[ 'title' => __( 'Abandoned Checkouts', 'surecart' ) ]
	); ?>

	<?php $table->display(); ?>
</div>
