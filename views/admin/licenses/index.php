<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Licenses', 'surecart' ),
		]
	);
	?>

	<?php $table->display(); ?>
</div>


