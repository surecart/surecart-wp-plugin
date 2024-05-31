<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php foreach ( $pagination_links as $pagination_link ) : ?>
		<a href="<?php echo esc_url( $pagination_link['href'] ); ?>"
			data-wp-on--click="surecart/product-list::actions.navigate"
			data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
			<?php if ( $pagination_link['current'] ) { ?>
				disabled
			<?php } ?>
			>
				<?php echo esc_html( $pagination_link['name'] ); ?>
			</a>
	<?php endforeach; ?>
</div>
