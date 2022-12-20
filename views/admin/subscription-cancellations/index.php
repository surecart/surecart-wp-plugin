<div class="wrap">
	<?php
		\SureCart::render(
			'layouts/partials/admin-index-header',
			[ 'title' => __( 'Subscription Cancellations', 'surecart' ) ]
		);
		?>

	<div id="stats"></div>

	<?php if ( $enabled ) : ?>
		<?php $table->display(); ?>
	<?php endif; ?>
</div>
