<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Orders', 'surecart' ),
			'new_link' => \SureCart::getUrl()->edit( 'order' ),
		]
	);
	?>

	<?php $table->search_form( __( 'Search Orders', 'surecart' ), 'sc-search-orders' ); ?>
	<?php $table->display(); ?>
</div>

