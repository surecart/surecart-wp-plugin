<div class="wrap">
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[ 'title' => __( 'Cancellations', 'surecart' ) ]
	);
	?>

	<?php
	if ( ! $enabled ) :
		\SureCart::render(
			'admin/cancellation-insights/cta-banner',
		);
		endif;
	?>

	<?php if ( $enabled ) : ?>
		<div id="app"></div>
	<?php endif; ?>

	<?php $table->display(); ?>
</div>
