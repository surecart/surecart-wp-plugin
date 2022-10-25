<div class="wrap">
	<?php \SureCart::render(
		'layouts/partials/admin-index-header',
		[ 'title' => __( 'Abandoned Checkouts', 'surecart' ) ]
	); ?>

	<div id="stats"></div>

	<?php $table->display(); ?>
</div>
