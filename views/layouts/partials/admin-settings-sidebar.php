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
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'order' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'order' === $tab ? 'active' : ''; ?>>
			<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="shopping-bag"></sc-icon>
			<?php esc_html_e( 'Orders & Receipts', 'surecart' ); ?>
		</sc-tab>
		<sc-upgrade-required required="<?php echo empty( $entitlements->abandoned_checkouts ) ? 'true' : 'false'; ?>">
			<sc-tab
			disabled="<?php echo empty( $entitlements->abandoned_checkouts ) ? 'true' : 'false'; ?>"
			href="
			<?php
			echo empty( $entitlements->abandoned_checkouts ) ?
				'#' :
				esc_url( add_query_arg( [ 'tab' => 'abandoned_checkout' ], menu_page_url( 'sc-settings', false ) ) );
			?>
			" <?php echo 'abandoned_checkout' === $tab ? 'active' : ''; ?>>
				<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="shopping-cart"></sc-icon>
				<?php esc_html_e( 'Abandoned Checkout', 'surecart' ); ?>
				<?php if ( empty( $entitlements->abandoned_checkouts ) ) : ?>
					<sc-premium-tag></sc-premium-tag>
				<?php endif; ?>
			</sc-tab>
		</sc-upgrade-required>

		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'customer_notification_protocol' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'customer_notification_protocol' === $tab ? 'active' : ''; ?>>
			<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="bell"></sc-icon>
			<?php esc_html_e( 'Notifications', 'surecart' ); ?>
		</sc-tab>

		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'subscription_protocol' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'subscription_protocol' === $tab ? 'active' : ''; ?>>
			<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="refresh-ccw"></sc-icon>
			<?php esc_html_e( 'Subscriptions', 'surecart' ); ?>
		</sc-tab>

		<sc-upgrade-required required="<?php echo empty( $entitlements->abandoned_checkouts ) ? 'true' : 'false'; ?>">
			<sc-tab
			disabled="<?php echo empty( $entitlements->subscription_preservation ) ? 'true' : 'false'; ?>"
			href="
			<?php
			echo empty( $entitlements->subscription_preservation ) ?
				'#' :
				esc_url( add_query_arg( [ 'tab' => 'subscription_preservation' ], menu_page_url( 'sc-settings', false ) ) );
			?>
			" <?php echo 'subscription_preservation' === $tab ? 'active' : ''; ?>>
				<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="bar-chart-2"></sc-icon>
				<?php esc_html_e( 'Subscription Saver', 'surecart' ); ?>
				<?php if ( empty( $entitlements->subscription_preservation ) ) : ?>
					<sc-premium-tag></sc-premium-tag>
				<?php endif; ?>
			</sc-tab>
		</sc-upgrade-required>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'tax_protocol' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'tax_protocol' === $tab ? 'active' : ''; ?>>
			<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="tag"></sc-icon>
			<?php esc_html_e( 'Taxes', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'shipping_protocol' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'shipping_protocol' === $tab ? 'active' : ''; ?>>
			<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="truck"></sc-icon>
			<?php esc_html_e( 'Shipping', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'processors' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'processors' === $tab ? 'active' : ''; ?>>
			<sc-icon slot="prefix" style="width: 18px; height: 18px; opacity: 0.7;" name="credit-card"></sc-icon>
			<?php esc_html_e( 'Payment Processors', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'export' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'export' === $tab ? 'active' : ''; ?> >
			<sc-icon style="font-size: 18px; width: 18px; stroke-width: 4; opacity: 0.7" name="layers" slot="prefix"></sc-icon>
			<?php esc_html_e( 'Data Export', 'surecart' ); ?>
		</sc-tab>
	<?php endif; ?>

	<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'connection' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'connection' === $tab ? 'active' : ''; ?> >
		<sc-icon style="font-size: 18px; width: 18px; stroke-width: 4; opacity: 0.7" name="upload-cloud" slot="prefix"></sc-icon>
		<?php esc_html_e( 'Connection', 'surecart' ); ?>
	</sc-tab>

	<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'advanced' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'advanced' === $tab ? 'active' : ''; ?> >
		<sc-icon style="font-size: 18px; width: 18px; stroke-width: 4; opacity: 0.7" name="sliders" slot="prefix"></sc-icon>
		<?php esc_html_e( 'Advanced', 'surecart' ); ?>
	</sc-tab>

	<?php if ( $is_free ) : ?>
		<div class="sc-item-stick-bottom">
			<sc-card href="<?php echo esc_url( $upgrade_url ); ?>" class="surecart-cta">
				<sc-flex flex-direction="column" flex-direction="column" style="--spacing: var(--sc-spacing-medium)">
					<sc-flex justify-content="flex-start">
						<sc-icon style="font-size: 18px; width: 18px; stroke-width: 4; color: var(--sc-color-primary-500)" name="zap"></sc-icon>
						<sc-text style="--font-size: var(--sc-font-size-large); --font-weight: var(--sc-font-weight-bold)"><?php esc_html_e( 'Boost Your Revenue', 'surecart' ); ?></sc-text>
					</sc-flex>
					<sc-text><?php esc_html_e( 'Unlock revenue boosting features when you upgrade to Pro!', 'surecart' ); ?></sc-text>
					<sc-button type="primary" href="<?php echo esc_url( $upgrade_url ); ?>" target="_blank">
						<?php esc_html_e( 'Upgrade To Premium', 'surecart' ); ?>
					</sc-button>
				</sc-flex>
			</sc-card>
		</div>
	<?php endif; ?>

	<a href="https://surecart.com/support/" target="_blank" class="surecart-help">
		<sc-icon style="font-size: 18px; width: 22px; stroke-width: 4;" name="life-buoy"></sc-icon>
		<?php esc_html_e( 'Help', 'surecart' ); ?>
	</a>

</div>
