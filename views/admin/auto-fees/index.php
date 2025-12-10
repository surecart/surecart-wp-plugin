<div class="wrap">
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title'    => __( 'Dynamic Pricing', 'surecart' ),
			'new_link' => \SureCart::getUrl()->edit( 'auto-fees' ),
		]
	);
	?>

	<?php $table->search_form( __( 'Search', 'surecart' ), 'sc-search-auto-fees' ); ?>

	<form id="auto-fees-filter" method="get">
		<?php $table->views(); ?>
		<?php $table->display(); ?>
	</form>
</div>
