<?php
/*
Template Name: SureCart Blank
Template Post Type: sc-product
*/
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="https://gmpg.org/xfn/11">
<style>
	body {
		background-color: #FBFBFB !important;
	}
	#layout_checkout {
		min-height: 100vh;
		max-width: 1160px;
		margin: 0 auto;
		display: flex;
		padding-top: 8vh;
		position: relative;
	}
	#layout_checkout::after {
		content: "";
		position: fixed;
		top: 0;
		right: 0;
		width: 50%;
		height: 100vh;
		background-color: white;
		box-shadow: 5px 0px 20px rgba(0, 0, 0, 0.12);
	}
	#layout_checkout > div {
		width: 100%;
		z-index: 99;
	}
	@media screen and (max-width: 782px) {
		#layout_checkout::after {
			display: none;
		}
	}
</style>
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
