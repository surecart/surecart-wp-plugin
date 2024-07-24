<?php

namespace SureCart\Integrations\Bricks\Concerns;

use Bricks\Helpers;

trait ConvertsBlocks {
	/**
	 * Show if we should populate content on empty.
	 *
	 * @var string
	 */
	public $show_populate_on_empty = false;

	/**
	 * Get the block html
	 *
	 * @param array  $block_attributes The block attributes.
	 * @param string $content          The block content.
	 *
	 * @return string
	 */
	protected function html( $block_attributes = [], $content = '' ) {
		// Previewing a template.
		if ( $this->show_populate_on_empty ) {
			$product = sc_get_product();
			if ( empty( $product ) && Helpers::is_bricks_template( $this->post_id ) ) {
				return $this->render_element_placeholder(
					[
						'title'       => esc_html__( 'For better preview select content to show.', 'surecart' ),
						'description' => esc_html__( 'Go to: Settings > Template Settings > Populate Content', 'surecart' ),
					]
				);
			}
		}

		$key        = '_root';
		$attributes = apply_filters( 'bricks/element/render_attributes', $this->attributes, $key, $this );

		// we need to remove this since this is processed twice for some blocks.
		add_filter( 'doing_it_wrong_trigger_error', [ $this, 'removeInteractivityDoingItWrong' ], 10, 2 );

		$block = do_blocks( '<!-- wp:' . $this->block_name . ' ' . wp_json_encode( $block_attributes, JSON_FORCE_OBJECT ) . ' -->' . $content . '<!-- /wp:' . $this->block_name . ' -->' );

		remove_filter( 'doing_it_wrong_trigger_error', [ $this, 'removeInteractivityDoingItWrong' ], 10 );

		// Return: No attributes set for this element.
		if ( ! isset( $attributes[ $key ] ) ) {
			return $block;
		}

		$processor = new \WP_HTML_Tag_Processor( $block );
		$processor->next_tag();

		$key        = '_root';
		$attributes = apply_filters( 'bricks/element/render_attributes', $this->attributes, $key, $this );

		// Return: No attributes set for this element.
		if ( ! isset( $attributes[ $key ] ) ) {
			return $processor->get_updated_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}

		foreach ( $attributes[ $key ] as $name => $value ) {
			if ( is_array( $value ) ) {
				// Filter out empty values.
				$value = array_filter(
					$value,
					function ( $val ) {
						return ! empty( $val ) || is_numeric( $val );
					}
				);
			}

			if ( 'class' === $name ) {
				foreach ( $value as $class ) {
					$processor->add_class( $class );
				}
			}
		}

		// return updated html.
		return $processor->get_updated_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Remove interactivity doing it wrong
	 *
	 * @param string $trigger Trigger.
	 * @param string $function_name Function name.
	 *
	 * @return string|false
	 */
	public function removeInteractivityDoingItWrong( $trigger, $function_name ) {
		if ( 'WP_Interactivity_API::evaluate' !== $function_name ) {
			return $trigger;
		}
		return false;
	}
}
