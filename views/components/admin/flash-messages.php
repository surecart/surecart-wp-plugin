<?php foreach ( \CheckoutEngine::flash()->get( 'errors' ) as $error ) : ?>
	<div class="notice notice-error is-dismissible"><p><?php echo esc_html( $error ); ?></p></div>
<?php endforeach; ?>

<?php foreach ( \CheckoutEngine::flash()->get( 'success' ) as $success ) : ?>
	<div class="notice notice-success is-dismissible"><p><?php echo esc_html( $success ); ?></p></div>
	<?php endforeach; ?>

<?php foreach ( \CheckoutEngine::flash()->get( 'info' ) as $info ) : ?>
	<div class="notice notice-info is-dismissible"><p><?php echo esc_html( $info ); ?></p></div>
<?php endforeach; ?>
