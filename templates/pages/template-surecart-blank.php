<?php
/*
Template Name: SureCart Blank
*/
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="https://gmpg.org/xfn/11">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

<?php do_action( 'surecart_before_content_wrapper' ); ?>

<div id="layout_checkout">
	<?php
	while ( have_posts() ) :
		the_post();
		the_content();
	endwhile;
	?>
</div>

<?php do_action( 'surecart_after_content_wrapper' ); ?>

</body>
<?php wp_footer(); ?>
