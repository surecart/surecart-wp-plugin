<?php
/*
Template Name: SureCart Dashboard
*/

use SureCart\Controllers\Web\DashboardController;

$controller = new DashboardController();
$data       = $controller->getData();
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
			<header class="sc-dashboard__header">
				<div class="sc-dashboard__logo">
					<a href="<?php echo esc_url( get_home_url() ); ?>">
						<?php \SureCart::render( 'layouts/partials/store-logo', $data ); ?>
					</a>
				</div>
				<?php \SureCart::render( 'layouts/partials/customer-dashboard/dashboard-navigation', $data ); ?>
			</header>

			<header class="sc-dashboard__header-mobile">
				<div class="sc-dashboard__logo">
					<?php \SureCart::render( 'layouts/partials/store-logo', $data ); ?>
				</div>

				<sc-dropdown class="sc-dashboard__mobile-menu" placement="bottom-right" distance="20">
					<sc-button circle slot="trigger"><sc-icon name="menu"></sc-icon></sc-button>
					<?php
					\SureCart::render(
						'layouts/partials/customer-dashboard/dashboard-navigation',
						array_merge(
							$data,
							[
								'is_mobile'    => true,
								'show_account' => true,
							]
						)
					);
					?>
				</sc-dropdown>
			</header>

			<div class="sc-dashboard__back sc-pin-bottom">
				<sc-button href="<?php echo esc_url( get_home_url() ); ?>" type="text" class="sc-link-home">
					<sc-icon name="arrow-left" slot="prefix"></sc-icon>
					<?php esc_html_e( 'Back Home' ); ?>
				</sc-button>
			</div>

			<div class="sc-dashboard__user-menu">
				<sc-dropdown style="width: 100%;" placement="top-right" distance="20">
					<sc-flex align-items="center" justify-content="space-between" slot="trigger" style="<?php echo isset( $attributes['color'] ) ? 'color:' . esc_attr( $attributes['color'] ) . ';' : ''; ?>">
						<sc-flex align-items="center" justify-content="space-between">
							<sc-avatar image="<?php echo esc_url( get_avatar_url( $data['user']->user_email, [ 'default' => '404' ] ) ); ?>" style="--sc-avatar-size: 34px" initials="<?php echo esc_attr( substr( $data['user']->display_name, 0, 1 ) ); ?>"></sc-avatar>
							<?php echo esc_html( $data['user']->display_name ); ?>
						</sc-flex>
						<sc-icon name="chevron-up"></sc-icon>
					</sc-flex>

					<sc-menu>
						<?php foreach ( $data['account_navigation'] as $navigation ) : ?>
							<?php
							\SureCart::render(
								'layouts/partials/customer-dashboard/dashboard-menu-item',
								[
									'icon_name' => $navigation['icon_name'],
									'name'      => $navigation['name'],
									'active'    => $navigation['active'],
									'href'      => $navigation['href'],
									'is_mobile' => true,
								]
							);
							?>
						<?php endforeach; ?>

						<?php if ( ! empty( $data['account_navigation'] ) ) : ?>
							<sc-menu-divider></sc-menu-divider>
						<?php endif; ?>

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

	<?php wp_footer(); ?>
</body>
</html>
