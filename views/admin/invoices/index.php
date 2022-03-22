
<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Invoices', 'surecart' ),
		]
	);
	?>

	<?php $table->display(); ?>
</div>

