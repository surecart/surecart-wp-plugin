<div class="wrap">

	<?php
	\SureCart::render( 'layouts/partials/admin-index-styles' );
	?>

	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[ 'title' => __( 'Subscription Insights', 'surecart' ) ]
	);
	?>
	<?php if ( $enabled ) : ?>
		<div id="app"></div>
	<?php endif; ?>


	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Subscriptions', 'surecart' ),
		]
	);
	?>

	<?php $table->search_form( __( 'Search Subscriptions', 'surecart' ), 'sc-search-subscriptions' ); ?>
	<?php $table->display(); ?>
</div>
