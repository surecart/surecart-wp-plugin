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

	<?php if ( $show_logo ) : ?>
		<header class="sc-buy-header">
			<img src="<?php echo esc_url( $logo_url ); ?>"
				style="object-fit: contain;
				object-position: left;
				max-width: 180px;
				max-height: 100px;
				alt="<?php echo esc_attr( get_bloginfo() ); ?>"
			/>
		</header>
	<?php endif; ?>

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
