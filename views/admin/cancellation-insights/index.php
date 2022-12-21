<div class="wrap">
	<?php
		\SureCart::render(
			'layouts/partials/admin-index-header',
			[ 'title' => __( 'Cancellation Insights', 'surecart' ) ]
		);
		?>

	<div id="app"></div>

	<?php if ( $enabled ) : ?>
		<?php $table->display(); ?>
	<?php endif; ?>
</div>
