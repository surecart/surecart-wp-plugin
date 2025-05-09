<?php foreach ( $product->variant_options->data as $key => $option ) : ?>
	<div
		<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
		<?php echo wp_kses_data( wp_interactivity_data_wp_context( array( 'optionNumber' => (int) $key + 1 ) ) ); ?>
	>
		<?php
		if ( 'dropdown' === $option->display_type ) :
			include 'select.php';
		else :
			include 'radio.php';
		endif;
		?>
	</div>
<?php endforeach; ?>
