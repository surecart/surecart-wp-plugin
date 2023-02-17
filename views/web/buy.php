<?php
/*
Template Name: SureCart
*/
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

<sc-product-buy-page id="product-buy-page"></sc-product-buy-page>

<?php
\SureCart::assets()->addComponentData( 'sc-product-buy-page', '#product-buy-page', [ 'product' => $product ] );
?>

<?php
wp_footer();
?>
</body>
</html>
