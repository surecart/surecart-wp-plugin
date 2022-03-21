<?php foreach ( \SureCart::flash()->get( 'errors' ) as $error ) : ?>
	<div class="notice notisc-error is-dismissible"><p><?php echo esc_html( $error ); ?></p></div>
<?php endforeach; ?>

<?php foreach ( \SureCart::flash()->get( 'success' ) as $success ) : ?>
	<div class="notice notisc-success is-dismissible"><p><?php echo esc_html( $success ); ?></p></div>
	<?php endforeach; ?>

<?php foreach ( \SureCart::flash()->get( 'info' ) as $info ) : ?>
	<div class="notice notisc-info is-dismissible"><p><?php echo esc_html( $info ); ?></p></div>
<?php endforeach; ?>
