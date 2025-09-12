<div class="wrap">
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Reviews', 'surecart' ),
		]
	);
	?>

	<?php $table->search_form( __( 'Search', 'surecart' ), 'sc-search-reviews' ); ?>

	<form id="reviews-filter" method="get">
		<?php $table->views(); ?>
		<?php $table->display(); ?>
	</form>
</div>