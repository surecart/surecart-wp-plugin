<?php
/*
Template Name: SureCart No Sidebar
Template Post Type: sc-product
*/

get_header(); ?>

<style>
.page-template-template-page-builder-php #content,
.page-template-template-page-builder-php .content,
.page-template-template-page-builder-php .site-inner,
.sc-product-template-generatepress.page-template-template-page-builder-php #page,
.sc-product-template.sc-product-template-evolve > #wrapper,
.sc-product-template.sc-product-template-evolve .content > .row,
.sc-product-template #page,
.sc-product-template,
.sc-product-template.sc-product-template-storefront.page-template-template-page-builder #content .col-full {
	max-width: 100% !important;
	width: 100% !important;
	padding: 0 !important;
	margin: 0 !important;
}

body.sc-product-template-twentysixteen.page-template-template-page-builder-no-sidebar-php #page,
body.sc-product-template-twentysixteen.page-template-template-page-builder-no-header-footer-php #page,
body.sc-product-template-twentysixteen.page-template-template-page-builder-php #page {
	margin: 0;
}

body.page-template-template-page-builder-no-sidebar-php:not(.custom-background-image):before,
body.page-template-template-page-builder-no-header-footer-php:not(.custom-background-image):before,
body.page-template-template-page-builder-php:not(.custom-background-image):before,
body.page-template-template-page-builder-no-sidebar-php:not(.custom-background-image):after,
body.page-template-template-page-builder-no-header-footer-php:not(.custom-background-image):after,
body.page-template-template-page-builder-php:not(.custom-background-image):after {
	height: 0;
}

.sc-product-template.sc-product-template-Spacious #main {
	padding: 0;
}

.sc-product-template.sc-product-template-Spacious .header-post-title-container {
	display: none;
}

.sc-product-template.sc-product-template-Spacious #main .inner-wrap{
	max-width: 100% !important;
	width: 100% !important;
	padding: 0 !important;
	margin: 0 !important;
}

.sc-product-template.sc-product-template-Sparkling .container.main-content-area {
	max-width: 100% !important;
	width: 100% !important;
	padding: 0 !important;
	margin: 0 !important;
}

.sc-product-template.sc-product-template-Sparkling .container.main-content-area .row {
	margin: 0;
}

.sc-product-template.sc-product-template-Sparkling .container.main-content-area .main-content-inner {
	float: none;
	width: 100%;
	padding: 0;
}

.page-template-template-page-builder-no-sidebar .side-pull-left .main-content-inner {
	width: 100%;
	float: none;
}

/* Storefront Theme */
.sc-product-template.sc-product-template-storefront.no-wc-breadcrumb .site-header {
	margin-bottom: 0;
}
</style>

<?php do_action( 'surecart_before_content_wrapper' ); ?>

<?php
while ( have_posts() ) :
	the_post();

	$prices = get_post_meta( get_the_ID(), 'prices' );
	?>

<!--
<sc-cart-form>
	<sc-choices label="<?php esc_attr_e( 'Choose a price', 'surecart' ); ?>">
		<?php foreach ( $prices as $price ) : ?>
			<sc-choice name="price" value="<?php echo esc_attr( $price->id ); ?>">
			<sc-format-number slot="price" type="currency" value="<?php echo esc_attr( $price->amount ); ?>" currency="<?php echo esc_attr( $price->currency ); ?>"></sc-format-number>
		</sc-choice>
		<?php endforeach; ?>
	</sc-choices>
	<sc-button submit type="primary"><?php esc_attr_e( 'Add To Cart', 'surecart' ); ?>
</sc-cart-form> -->


	<?php
	do_action( 'surecart_page_elements' );
	endwhile;
?>
<?php do_action( 'surecart_after_content_wrapper' ); ?>

<?php get_footer(); ?>
