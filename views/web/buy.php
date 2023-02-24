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
</head>

<body <?php body_class(); ?>>
	<?php do_action( 'surecart_buy_page_body_open' ); ?>

	<?php
	ob_start();
	require 'buy-template.php';
	$content = ob_get_clean();
	$price   = $product->prices->data[0];
	if ( $price ) {
		echo wp_kses_post(
			( new FormBlock() )->render(
				[
					'prices'  => [
						[
							'id'         => $price->id,
							'product_id' => $product->id,
							'quantity'   => 1,
						],
					],
					'mode'    => 'live',
					'form_id' => -1,
				],
				do_blocks( $content )
			)
		);
	}
	?>

	<?php wp_footer(); ?>
</body>
</html>
