<?php \CheckoutEngine::render( 'components/admin/flash-messages' ); ?>

<h1 class="wp-heading-inline"><?php echo wp_kses_post( $title ?? '' ); ?></h1>

<?php if ( isset( $new_link ) ) : ?>
	<a href="<?php echo esc_url( \CheckoutEngine::getUrl()->edit( $new_link ) ); ?>" class="page-title-action">
		<?php esc_html_e( 'Add New', 'checkout_engine' ); ?>
	</a>
<?php endif; ?>

<hr class="wp-header-end" />
