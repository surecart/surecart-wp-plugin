<?php
/**
 * Shared list-page header for admin DataView screens (Products, Product
 * Collections, and future entity list pages).
 *
 * Renders the `.wrap.sc-list-header` block with flash messages, heading,
 * and optional "Add New" action. Entity pages supply their own `$id` so
 * JS can sync visibility on detail/create views (see ProductsApp.js,
 * ProductCollectionsApp.js).
 *
 * Expected variables:
 *
 * @var string      $id           DOM id for JS visibility sync (e.g. "sc-products-list-header").
 * @var string      $title        Page title, printed in the H1.
 * @var string|null $action_label Button label (e.g. "Add Product"). Omit/empty to hide.
 * @var string|null $new_link     Button URL. Omit/empty to hide the button.
 */
?>
<div class="wrap sc-list-header" id="<?php echo esc_attr( $id ); ?>">
	<?php \SureCart::render( 'components/admin/flash-messages' ); ?>
	<div class="sc-list-header__bar">
		<h1 class="wp-heading-inline"><?php echo esc_html( $title ); ?></h1>
		<?php if ( ! empty( $new_link ) && ! empty( $action_label ) ) : ?>
			<a href="<?php echo esc_url( $new_link ); ?>" class="button button-primary sc-list-header__action" data-test-id="add-new-button">
				<?php echo esc_html( $action_label ); ?>
			</a>
		<?php endif; ?>
	</div>
	<hr class="wp-header-end" />
</div>
