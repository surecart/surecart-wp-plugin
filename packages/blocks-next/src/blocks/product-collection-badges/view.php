<div class="is-layout-flex sc-product-collection-badges">
	<?php foreach ( $collections as $collection ) { ?>
		<a
			class="sc-product-collection-badge"
			href="<?php echo esc_url( $collection->permalink ); ?>"
			class="sc-product-collection-badge <?php echo esc_attr( $classes ); ?>"
			style="<?php echo esc_attr( $style ); ?>"
		>
			<span aria-hidden="true"><?php echo esc_html( $collection->name ); ?></span>
			<?php // translators: %s: collection name. ?>
			<span class="sc-screen-reader-text"><?php echo esc_html( sprintf( __( 'Link to %s product collection.', 'surecart' ), $collection->name ) ); ?></span>
		</a>
	<?php }?>
</div>

