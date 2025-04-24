<?php foreach ( $product->variant_options->data as $key => $option ) : ?>
	<div
		<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
		<?php echo wp_kses_data( wp_interactivity_data_wp_context( array( 'optionNumber' => (int) $key + 1 ) ) ); ?>
	>
		<label class="sc-form-label">
			<?php echo wp_kses_post( $option->name ); ?>
		</label>

		<?php
		if ( 'dropdown' === $option->display_type ) :
			wp_enqueue_style( 'surecart-select' );
			require 'select.php';
		else :
			require 'radio.php';
		endif;
		?>
	</div>
<?php endforeach; ?>
