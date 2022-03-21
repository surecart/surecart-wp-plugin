<ce-card style="font-size: 16px;">
	<ce-text tag="h2" style="--font-size: var(--ce-font-size-x-large);">
	<?php esc_html_e( 'It looks like you are not yet a customer.', 'surecart' ); ?></ce-text>
	<ce-text tag="p" style="--color: var(--ce-font-color-gray-500)">
		<?php esc_html_e( 'You must first purchase something to access your dashboard.', 'surecart' ); ?>
	</ce-text>
	<ce-button type="primary" href="<?php echo esc_url( get_home_url() ); ?>">
		<?php esc_html_e( 'Home', 'surecart' ); ?>
	</ce-button>
	<ce-button type="text" href="<?php echo esc_url( wp_logout_url( get_home_url() ) ); ?>">
		<?php esc_html_e( 'Logout', 'surecart' ); ?>
	</ce-button>
</ce-card>
