<?php
$dashboard_url = get_permalink( get_the_ID() );
$is_mobile     = $is_mobile ?? false;
$show_account  = $show_account ?? false;
?>

<?php echo ! empty( $is_mobile ) ? '<sc-menu>' : '<sc-spacing style="--spacing: var(--sc-spacing-xx-small);">'; ?>
	<?php
	\SureCart::render(
		'layouts/partials/customer-dashboard/dashboard-menu-item',
		[
			'icon_name' => 'server',
			'name'      => __( 'Dashboard', 'surecart' ),
			'active'    => 'dashboard' === $active_tab,
			'href'      => $dashboard_url,
			'is_mobile' => $is_mobile,
		]
	);
	?>

	<?php
	\SureCart::render(
		'layouts/partials/customer-dashboard/dashboard-menu-item',
		[
			'icon_name' => 'shopping-bag',
			'name'      => __( 'Orders', 'surecart' ),
			'active'    => 'order' === $active_tab,
			'href'      => '#',
			'is_mobile' => $is_mobile,
		]
	);
	?>

	<?php
	\SureCart::render(
		'layouts/partials/customer-dashboard/dashboard-menu-item',
		[
			'icon_name' => 'repeat',
			'name'      => __( 'Plans', 'surecart' ),
			'active'    => 'subscription' === $active_tab,
			'href'      => '#',
			'is_mobile' => $is_mobile,
		]
	);
	?>

	<?php if ( $show_account ) : ?>
		<sc-menu-divider></sc-menu-divider>
		<?php
		\SureCart::render(
			'layouts/partials/customer-dashboard/dashboard-menu-item',
			[
				'icon_name' => 'credit-card',
				'name'      => __( 'Billing', 'surecart' ),
				'active'    => false,
				'href'      => '#',
				'is_mobile' => $is_mobile,
			]
		);
		?>

		<?php
		\SureCart::render(
			'layouts/partials/customer-dashboard/dashboard-menu-item',
			[
				'icon_name' => 'user',
				'name'      => __( 'Account', 'surecart' ),
				'active'    => false,
				'href'      => '#',
				'is_mobile' => $is_mobile,
			]
		);
		?>

		<sc-menu-divider></sc-menu-divider>

		<?php
		\SureCart::render(
			'layouts/partials/customer-dashboard/dashboard-menu-item',
			[
				'icon_name' => 'log-out',
				'name'      => __( 'Log Out', 'surecart' ),
				'active'    => false,
				'href'      => '#',
				'is_mobile' => $is_mobile,
			]
		);
		?>
	<?php endif; ?>

<?php
echo ! empty( $is_mobile ) ? '</sc-menu>' : '</sc-spacing>';
