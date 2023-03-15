<?php
/*
Template Name: SureCart
*/

use SureCartBlocks\Blocks\Form\Block as FormBlock;


?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
	<style>
	/** block editor theme fix. */
	body .is-layout-constrained > * + * {
		margin-top: 0;
	}
	</style>
</head>

<body <?php body_class( 'sc-buy-page' ); ?>>
	<?php do_action( 'surecart_buy_page_body_open' ); ?>

	<header class="sc-buy-header">
		<?php if ( $show_logo ) : ?>
			<img src="<?php echo esc_url( $logo_url ); ?>"
				style="object-fit: contain;
				object-position: left;
				max-width: 180px;
				max-height: 100px;
				alt="<?php echo esc_attr( get_bloginfo() ); ?>"
			/>
		<?php else : ?>
			<sc-text style="--font-size: var(--sc-font-size-xx-large); --font-weight: var(--sc-font-weight-bold)"><?php echo esc_html( get_bloginfo() ); ?></sc-text>
		<?php endif; ?>
		<?php if ( ! empty( $user->ID ) ) : ?>
			<sc-dropdown position="bottom-right" style="font-size: 15px;">
				<sc-avatar image="<?php echo esc_url( get_avatar_url( $user->user_email, [ 'default' => '404' ] ) ); ?>" style="--sc-avatar-size: 34px" slot="trigger" initials="<?php echo esc_attr( substr( $user->display_name, 0, 1 ) ); ?>"></sc-avatar>
				<sc-menu>
					<?php if ( ! empty( $dashboard_link ) ) : ?>
						<sc-menu-item href="<?php echo esc_url( $dashboard_link ); ?>">
							<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
						</sc-menu-item>
					<?php endif; ?>

					<?php if ( ! empty( $logout_link ) ) : ?>
						<sc-menu-item href="<?php echo esc_url( $logout_link ); ?>">
							<?php esc_html_e( 'Logout', 'surecart' ); ?>
						</sc-menu-item>
					<?php endif; ?>
				</sc-menu>
			</sc-dropdown>
		<?php endif; ?>
	</header>


	<?php
	ob_start();
	require 'buy-template.php';
	$content = ob_get_clean();

	echo filter_block_content(
		( new FormBlock() )->render(
			[
				'prices'  => [
					[
						'id'         => $selected_price->id,
						'product_id' => $product->id,
						'quantity'   => 1,
					],
				],
				'product' => $product,
				'mode'    => $mode,
			],
			do_blocks( $content )
		),
	);

	?>

	<?php wp_footer(); ?>
</body>
</html>
