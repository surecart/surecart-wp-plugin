<div id="sc-nav" style="--sc-tabs-min-width: 0;">
	<?php if ( (bool) \SureCart\Models\ApiToken::get() ) : ?>
		<sc-tab href="<?php echo esc_url( remove_query_arg( 'tab' ) ); ?>" <?php echo ! $tab ? 'active' : ''; ?>>
			<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="sliders"></sc-icon>
			<?php esc_html_e( 'Store Settings', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'brand' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'brand' === $tab ? 'active' : ''; ?>>
			<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="pen-tool"></sc-icon>
			<?php esc_html_e( 'Design & Branding', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'customer_notification_protocol' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'customer_notification_protocol' === $tab ? 'active' : ''; ?>>
			<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="bell"></sc-icon>
			<?php esc_html_e( 'Customer Notifications', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'subscription_protocol' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'subscription_protocol' === $tab ? 'active' : ''; ?>>
			<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="refresh-ccw"></sc-icon>
			<?php esc_html_e( 'Subscriptions', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'portal_protocol' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'portal_protocol' === $tab ? 'active' : ''; ?>>
			<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="briefcase"></sc-icon>
			<?php esc_html_e( 'Customer Portal', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'tax_protocol' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'tax_protocol' === $tab ? 'active' : ''; ?>>
			<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="tag"></sc-icon>
			<?php esc_html_e( 'Taxes', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'processors' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'processors' === $tab ? 'active' : ''; ?>>
			<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="credit-card"></sc-icon>
			<?php esc_html_e( 'Processors', 'surecart' ); ?>
		</sc-tab>
	<?php endif; ?>

	<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'connection' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'connection' === $tab ? 'active' : ''; ?> >
		<sc-icon style="font-size: 18px; width: 22px; stroke-width: 4; opacity: 0.7" name="upload-cloud" slot="prefix"></sc-icon>
		<?php esc_html_e( 'Connection', 'surecart' ); ?>
	</sc-tab>

	<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'advanced' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'advanced' === $tab ? 'active' : ''; ?> >
		<sc-icon style="font-size: 18px; width: 22px; stroke-width: 4; opacity: 0.7" name="sliders" slot="prefix"></sc-icon>
		<?php esc_html_e( 'Advanced', 'surecart' ); ?>
	</sc-tab>

	<sc-tab href="mailto:hello@surecart.com" target="_blank">
		<sc-icon style="font-size: 18px; width: 22px; stroke-width: 4; opacity: 0.7" name="life-buoy" slot="prefix"></sc-icon>
		<?php esc_html_e( 'Help', 'surecart' ); ?>
	</sc-tab>
</div>
