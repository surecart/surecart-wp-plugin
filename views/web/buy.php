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

<body <?php body_class(); ?>>
	<?php do_action( 'surecart_buy_page_body_open' ); ?>


	<?php
	ob_start();
	require 'buy-template.php';
	$content = ob_get_clean();

	if ( $price ) {
		echo filter_block_content(
			( new FormBlock() )->render(
				[
					'prices'  => [
						[
							'id'         => $price->id,
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
	}
	?>

	<?php wp_footer(); ?>
</body>
</html>
