<div class="notice notice-warning surecart-webhook-change-notice">
	<div class="breadcrumbs">
		<img style="display: block" src="<?php echo esc_url( trailingslashit( plugin_dir_url( SURECART_PLUGIN_FILE ) ) . 'images/logo.svg' ); ?>" alt="SureCart" width="125">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			>
			<polyline points="9 18 15 12 9 6" />
		</svg>
		<span><?php esc_html_e( 'Safe Mode', 'surecart' ); ?></span>
	</div>
	<h1><?php esc_html_e( 'Safe Mode has been activated', 'surecart' ); ?></h1>
	<p class="description">
		<?php
		esc_html_e(
			'Your site is in Safe Mode because you have 2 SureCart stores that appear to be duplicates.',
			'surecart'
		);
		?>
		<br />
		<?php
		esc_html_e(
			'Two sites that are telling SureCart they are the same site.',
			'surecart'
		);
		?>
		<a href="https://docs.surecart.com/article/what-is-safe-mode" target="_blank" class="learn-more-safe-mode">
			<?php esc_html_e( 'Learn more about Safe Mode.', 'surecart' ); ?>
		</a>
	</p>
	<div class="webhook-cards">
		<div class="webhook-card">
			<h2><?php esc_html_e( 'Update SureCart site connection', 'surecart' ); ?></h2>
			<p>
			<?php
			printf(
				/* translators: 1) current webhook url 2) previous webhook url */
				wp_kses_post( __( 'Your connection will be updated to <b>%1$s</b>.<br><b>%2$s</b> will be disconnected from SureCart.', 'surecart' ) ),
				esc_url( $current_web_url ),
				esc_url( $previous_web_url )
			);
			?>
			</p>
			<div class="webhook-links">
				<span class="previous-webhook"><?php echo esc_url( $previous_web_url ); ?></span>
				<span class="previous-to-current"> ↓ </span>
				<span class="current-webhook"><?php echo esc_url( $current_web_url ); ?></span>
				<p class="webhook-action-link">
					<a href="<?php echo esc_url( $update_url ); ?>">
						<?php esc_html_e( 'I Changed My Site Address', 'surecart' ); ?>
					</a>
				</p>
			</div>
		</div>
		<div class="webhook-card">
			<h2><?php esc_html_e( 'Treat each as independent sites', 'surecart' ); ?></h2>
			<p>
			<?php
			printf(
				/* translators: 1) current webhook url 2) previous webhook url */
				wp_kses_post( __( '<b>%1$s</b> will add a new connection to SureCart.<br><b>%2$s</b> will keep its existing connection.', 'surecart' ) ),
				esc_url( $current_web_url ),
				esc_url( $previous_web_url )
			);
			?>
			</p>
			<div class="webhook-links">
				<span class="current-webhook"><?php echo esc_url( $previous_web_url ); ?></span>
				<span> - </span>
				<span class="current-webhook"><?php echo esc_url( $current_web_url ); ?></span>
				<p class="webhook-action-link">
					<a href="<?php echo esc_url( $add_url ); ?>">
						<?php esc_html_e( 'This Is A Duplicate Or Staging Site', 'surecart' ); ?>
					</a>
				</p>
			</div>
		</div>
	</div>
</div>
