<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Invoices', 'surecart' ),
			'new_link' => \SureCart::getUrl()->edit( 'invoices' ),
		]
	);
	?>

	<?php $table->search_form( __( 'Search Invoices', 'surecart' ), 'sc-search-invoices' ); ?>

	<form id="posts-filter" method="get">
		<?php $table->views(); ?>
		<?php $table->display(); ?>

		<div id="ajax-response"></div>
	</form>
</div>

