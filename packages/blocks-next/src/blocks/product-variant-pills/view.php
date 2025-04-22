<?php foreach ( $product->variant_options->data as $key => $option ) : ?>
	<div
		<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
		<?php echo wp_kses_data( wp_interactivity_data_wp_context( array( 'optionNumber' => (int) $key + 1 ) ) ); ?>
	>
		<label class="sc-form-label">
			<?php echo wp_kses_post( $option->name ); ?>
		</label>

		<?php if ( 'dropdown' === $option->display_type ) : ?>
			<?php wp_enqueue_style( 'surecart-select' ); ?>
			<div class="sc-select-option__wrapper">
				<select class="sc-form-select" data-wp-on--change="callbacks.setOption">
					<?php foreach ( $option->values as $key => $value ) : ?>
					<option
						value="<?php echo esc_attr( $value ); ?>"
						data-wp-bind--selected="state.isOptionSelected"
						<?php
						echo wp_kses_data(
							wp_interactivity_data_wp_context(
								array(
									'option_value'      => $value,
									'option_name'       => $option->name,
									'option_name_slug'  => sanitize_title( $option->name ),
									'option_value_slug' => sanitize_title( $value ),
								)
							)
						);
						?>
						>
							<?php echo esc_html( $value ); ?>
					</option>
				<?php endforeach; ?>
				</select>
			</div>
		<?php else : ?>
			<div class="sc-pill-option__wrapper">
				<?php
				foreach ( $option->values as $value ) :
					// Get an instance of the current Post Template block.
					$block_instance = $block->parsed_block;

					// Set the block name to one that does not correspond to an existing registered block.
					// This ensures that for the inner instances of the Post Template block, we do not render any block supports.
					$block_instance['blockName'] = 'core/null';

					$filter_block_context = static function ( $context ) use ( $value, $option ) {
						$context['value'] = $value;
						$context['name']  = $option->name;
						return $context;
					};

					// Use an early priority to so that other 'render_block_context' filters have access to the values.
					add_filter( 'render_block_context', $filter_block_context, 1 );
					// Render the inner blocks of the Post Template block with `dynamic` set to `false` to prevent calling
					// `render_callback` and ensure that no wrapper markup is included.
					$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
					remove_filter( 'render_block_context', $filter_block_context, 1 );
					?>

					<?php echo $block_content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

				<?php endforeach; ?>
			</div>
		<?php endif; ?>
	</div>
<?php endforeach; ?>
