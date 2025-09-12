<div class="wrap">
	<?php \SureCart::render( 'layouts/partials/admin-index-styles' ); ?>
	<?php
	\SureCart::render(
		'layouts/partials/admin-index-header',
		[
			'title' => __( 'Reviews', 'surecart' ),
		]
	);
	?>

	<sc-spacing style="--spacing: var(--sc-spacing-large)">
		<sc-reviews-list
			api-token="<?php echo esc_attr( \SureCart::account()->api_token ); ?>"
		>
		</sc-reviews-list>
	</sc-spacing>
</div>