<div class="wrap" id="sc-products-list-header">
	<?php \SureCart::render( 'components/admin/flash-messages' ); ?>
	<h1 class="wp-heading-inline"><?php esc_html_e( 'Products', 'surecart' ); ?></h1>
	<?php if ( ! empty( $new_link ) ) : ?>
		<a href="<?php echo esc_url( $new_link ); ?>" class="page-title-action" data-test-id="add-new-button">
			<?php esc_html_e( 'Add New', 'surecart' ); ?>
		</a>
	<?php endif; ?>
	<hr class="wp-header-end" />
</div>

<div id="sc-products-app"></div>
