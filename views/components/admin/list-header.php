<?php
/**
 * Shared list-page header.
 *
 * @var string      $id           DOM id used by JS visibility sync.
 * @var string      $title        Page title.
 * @var string|null $action_label Optional CTA label.
 * @var string|null $new_link     Optional CTA url.
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
