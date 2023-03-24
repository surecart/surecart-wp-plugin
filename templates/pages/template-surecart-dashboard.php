<?php
/*
Template Name: SureCart Dashboard
*/

$logo_url      = \SureCart::account()->brand->logo_url;
$logo_width    = get_post_meta( get_the_ID(), '_surecart_dashboard_logo_width', true );
$current_url   = ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$user          = wp_get_current_user();
$dashboard_url = get_permalink( get_the_ID() );
$active_tab    = esc_html( $_GET['model'] ?? 'dashboard' );

?>

<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<?php do_action( 'surecart_template_dashboard_body_open' ); ?>

	<div class="sc-dashboard">
		<div class="sc-dashboard__column dashboard-left is-sticky">
			<div class="sc-dashboard__back">
				<sc-button href="<?php echo esc_url( get_home_url() ); ?>" type="text" class="sc-link-home">
					<sc-icon name="arrow-left" slot="prefix"></sc-icon>
					<?php esc_html_e( 'Back Home' ); ?>
				</sc-button>
			</div>

			<header class="sc-dashboard__header">
				<div class="sc-dashboard__logo">
					<?php
					\SureCart::render(
						'layouts/partials/store-logo',
						[
							'logo_width' => $logo_width,
						]
					);
					?>
				</div>

				<?php
				\SureCart::render(
					'layouts/partials/customer-dashboard/dashboard-navigation',
					[
						'active_tab' => esc_html( $_GET['model'] ?? 'dashboard' ),
					]
				);
				?>
			</header>

			<header class="sc-dashboard__header-mobile">
				<div class="sc-dashboard__logo">
					<?php
					\SureCart::render(
						'layouts/partials/store-logo',
						[
							'logo_width' => $logo_width,
						]
					);
					?>
				</div>
				<sc-dropdown class="sc-dashboard__mobile-menu" placement="bottom-right">
					<sc-button circle slot="trigger"><sc-icon name="menu"></sc-icon></sc-button>
					<?php
					\SureCart::render(
						'layouts/partials/customer-dashboard/dashboard-navigation',
						[
							'active_tab'   => esc_html( $_GET['model'] ?? 'dashboard' ),
							'is_mobile'    => true,
							'show_account' => true,
						]
					);
					?>
				</sc-dropdown>
			</header>

			<div class="sc-dashboard__user-menu sc-pin-bottom">
				<sc-dropdown style="width: 100%;" placement="top-right">
					<sc-flex  align-items="center" justify-content="space-between" slot="trigger" style="<?php echo isset( $attributes['color'] ) ? 'color:' . esc_attr( $attributes['color'] ) . ';' : ''; ?>">
						<sc-flex align-items="center" justify-content="space-between">
							<sc-avatar image="<?php echo esc_url( get_avatar_url( $user->user_email, [ 'default' => '404' ] ) ); ?>" style="--sc-avatar-size: 34px" initials="<?php echo esc_attr( substr( $user->display_name, 0, 1 ) ); ?>"></sc-avatar>
							<?php echo esc_html( $current_user->display_name ); ?>
						</sc-flex>
						<sc-icon name="chevron-up"></sc-icon>
					</sc-flex>

					<sc-menu>
						<sc-menu-item>
							<sc-icon name="credit-card" slot="prefix" style="opacity: 0.65;"></sc-icon>
							<?php echo esc_html_e( 'Billing', 'surecart' ); ?>
						</sc-menu-item>
						<sc-menu-item>
							<sc-icon name="user" slot="prefix" style="opacity: 0.65;"></sc-icon>
							<?php echo esc_html_e( 'Account', 'surecart' ); ?>
						</sc-menu-item>
						<sc-menu-divider></sc-menu-divider>
						<sc-menu-item>
							<sc-icon name="log-out" slot="prefix" style="opacity: 0.65;"></sc-icon>
							<?php echo esc_html_e( 'Log Out', 'surecart' ); ?>
						</sc-menu-item>
					</sc-menu>
				</sc-dropdown>
			</div>
		</div>

		<div class="sc-dashboard__column dashboard-right">
			<?php
			while ( have_posts() ) :
				the_post();
				the_content();
				endwhile;
			?>
		</div>
	</div>

	<!--
	<sc-columns is-stacked-on-mobile="1" is-full-height class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-right is-full-height is-sticky" style="gap:0px 0px;">
		<sc-column class="dashboard-left is-sticky">
			<div style="margin-bottom: var(--sc-spacing-x-large)">
				<sc-button href="<?php echo esc_url( get_home_url() ); ?>" type="text" class="sc-link-home">
					<sc-icon name="arrow-left" slot="prefix"></sc-icon>
					<?php esc_html_e( 'Back Home' ); ?>
				</sc-button>
			</div>

			<header class="sc-dashboard-header">
				<div class="sc-dashboard-logo">
					<?php
					\SureCart::render(
						'layouts/partials/store-logo',
						[
							'logo_width' => $logo_width,
						]
					);
					?>
				</div>

				<?php
				\SureCart::render(
					'layouts/partials/customer-dashboard/dashboard-navigation',
					[
						'active_tab' => esc_html( $_GET['model'] ?? 'dashboard' ),
					]
				);
				?>
			</header>

			<header class="sc-dashboard-header-mobile">
				<div class="sc-dashboard-logo">
					<?php
					\SureCart::render(
						'layouts/partials/store-logo',
						[
							'logo_width' => $logo_width,
						]
					);
					?>
				</div>
				<sc-dropdown class="sc-mobile-menu" placement="bottom-right">
					<sc-button circle slot="trigger"><sc-icon name="menu"></sc-icon></sc-button>
					<?php
					\SureCart::render(
						'layouts/partials/customer-dashboard/dashboard-navigation',
						[
							'active_tab'   => esc_html( $_GET['model'] ?? 'dashboard' ),
							'is_mobile'    => true,
							'show_account' => true,
						]
					);
					?>
				</sc-dropdown>
			</header>

			<div class="sc-user-menu sc-pin-bottom">
				<sc-dropdown style="width: 100%;" placement="top-right">
					<sc-flex class="sc-user-menu" align-items="center" justify-content="space-between" slot="trigger" style="<?php echo isset( $attributes['color'] ) ? 'color:' . esc_attr( $attributes['color'] ) . ';' : ''; ?>">
						<sc-flex align-items="center" justify-content="space-between">
							<sc-avatar image="<?php echo esc_url( get_avatar_url( $user->user_email, [ 'default' => '404' ] ) ); ?>" style="--sc-avatar-size: 34px" initials="<?php echo esc_attr( substr( $user->display_name, 0, 1 ) ); ?>"></sc-avatar>
							<?php echo esc_html( $current_user->display_name ); ?>
						</sc-flex>
						<sc-icon name="chevron-up"></sc-icon>
					</sc-flex>

					<sc-menu>
						<sc-menu-item>
							<sc-icon name="credit-card" slot="prefix" style="opacity: 0.65;"></sc-icon>
							<?php echo esc_html_e( 'Billing', 'surecart' ); ?>
						</sc-menu-item>
						<sc-menu-item>
							<sc-icon name="user" slot="prefix" style="opacity: 0.65;"></sc-icon>
							<?php echo esc_html_e( 'Account', 'surecart' ); ?>
						</sc-menu-item>
						<sc-menu-divider></sc-menu-divider>
						<sc-menu-item>
							<sc-icon name="log-out" slot="prefix" style="opacity: 0.65;"></sc-icon>
							<?php echo esc_html_e( 'Log Out', 'surecart' ); ?>
						</sc-menu-item>
					</sc-menu>
				</sc-dropdown>
			</div>

		</sc-column>

		<sc-column class="dashboard-right is-layout-constrained">
			<?php
			while ( have_posts() ) :
				the_post();
				the_content();
			endwhile;
			?>
		</sc-column>
	</sc-columns>
		-->

	<?php wp_footer(); ?>
</body>
</html>
