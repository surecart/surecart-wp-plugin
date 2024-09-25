<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>
	<style>.column-invoice { width: 150px}</style>
	<?php
	$live_mode    = isset( $_GET['live_mode'] ) ? sanitize_text_field( wp_unslash( $_GET['live_mode'] ) ) : 'true';
	$new_link_url = \SureCart::getUrl()->edit( 'invoices' ) . '&live_mode=' . $live_mode;

	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Invoices', 'surecart' ),
			'new_link' => $new_link_url,
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

