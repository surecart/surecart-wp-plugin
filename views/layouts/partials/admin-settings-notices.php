<?php if ( ! empty( $status ) ) : ?>
	<style>
		.notice {
			margin-left: 0;
			margin-right: 0;
		}
	</style>
	<?php if ( 'saved' === $status ) : ?>
		<div class="notice notice-success is-dismissible">
			<p><?php esc_html_e( 'Saved.', 'surecart' ); ?></p>
		</div>
	<?php endif; ?>

	<?php if ( 'missing' === $status ) : ?>
		<div class="notice notice-error is-dismissible">
			<p><?php esc_html_e( 'Please enter an API key.', 'surecart' ); ?></p>
		</div>
	<?php endif; ?>
<?php endif; ?>
