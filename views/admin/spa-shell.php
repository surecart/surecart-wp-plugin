<div class="wrap" id="sc-spa-index-header">
	<?php \SureCart::render( 'components/admin/flash-messages' ); ?>
	<h1 class="wp-heading-inline"><?php echo wp_kses_post( $title ?? '' ); ?></h1>
	<?php if ( isset( $new_link ) ) : ?>
		<a href="<?php echo esc_url( $new_link ); ?>" class="page-title-action" data-test-id="add-new-button">
			<?php esc_html_e( 'Add New', 'surecart' ); ?>
		</a>
	<?php endif; ?>
	<hr class="wp-header-end" />
</div>

<div id="sc-admin-spa-app"></div>
