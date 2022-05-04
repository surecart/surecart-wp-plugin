<div id="sc-nav" style="--sc-tabs-min-width: 0;">
	<?php if ( (bool) \SureCart\Models\ApiToken::get() ) : ?>
		<sc-tab href="<?php echo esc_url( remove_query_arg( 'tab' ) ); ?>" <?php echo ! $tab ? 'active' : ''; ?>>
			<svg slot="prefix" style="width: 22px; height: 22px; opacity: 0.7;" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img" aria-labelledby="ak99q9o1s3kinsboropozddhmci0oj6r">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
			</svg>
			<?php esc_html_e( 'Store Settings', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'brand' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'brand' === $tab ? 'active' : ''; ?>>
			<svg slot="prefix" style="width: 22px; height: 22px; opacity: 0.7;" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img" aria-labelledby="ai12f1ydn6kusa0itfwnv692wi78pgld">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
			</svg>
			<?php esc_html_e( 'Design & Branding', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'customer_notification_protocol' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'customer_notification_protocol' === $tab ? 'active' : ''; ?>>
			<svg stroke="currentColor" style="width: 22px; height: 22px; opacity: 0.7;" xmlns="http://www.w3.org/2000/svg" slot="prefix" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img" aria-labelledby="ai12f1ydn6kusa0itfwnv692wi78pgld">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
			</svg>
			<?php esc_html_e( 'Customer Notifications', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'subscription_protocol' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'subscription_protocol' === $tab ? 'active' : ''; ?>>
			<svg stroke="currentColor" style="width: 22px; height: 22px; opacity: 0.7;" xmlns="http://www.w3.org/2000/svg" slot="prefix" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img" aria-labelledby="ai12f1ydn6kusa0itfwnv692wi78pgld">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
			</svg>
			<?php esc_html_e( 'Subscriptions', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'portal_protocol' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'portal_protocol' === $tab ? 'active' : ''; ?>>
			<svg stroke="currentColor" style="width: 22px; height: 22px; opacity: 0.7;" xmlns="http://www.w3.org/2000/svg" slot="prefix" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img" aria-labelledby="ai12f1ydn6kusa0itfwnv692wi78pgld">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
			</svg>
			<?php esc_html_e( 'Customer Portal', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'tax_protocol' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'tax_protocol' === $tab ? 'active' : ''; ?>>
			<svg stroke="currentColor" style="width: 22px; height: 22px; opacity: 0.7;" xmlns="http://www.w3.org/2000/svg" slot="prefix" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img" aria-labelledby="ai12f1ydn6kusa0itfwnv692wi78pgld">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path>
			</svg>
			<?php esc_html_e( 'Taxes', 'surecart' ); ?>
		</sc-tab>
		<sc-tab href="<?php echo esc_url( add_query_arg( [ 'tab' => 'processors' ], menu_page_url( 'sc-settings', false ) ) ); ?>" <?php echo 'processors' === $tab ? 'active' : ''; ?>>
			<svg stroke="currentColor" style="width: 22px; height: 22px; opacity: 0.7;" xmlns="http://www.w3.org/2000/svg" slot="prefix" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img" aria-labelledby="ai12f1ydn6kusa0itfwnv692wi78pgld">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
			</svg>
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
</div>
