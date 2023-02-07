<?php

namespace SureCartBlocks\Blocks\CollapsibleRow;

use SureCart\Models\Form;
use SureCartBlocks\Blocks\BaseBlock;

/**
 * Checkout block
 */
class Block extends BaseBlock {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		add_action(
			'wp_footer',
			function() {  ?>
	<style>
			sc-toggle + sc-toggle {
				margin-top: -20px;
			}
			sc-toggle {
				width: 100%;
				border-top: solid var(--sc-input-border-width) var(--sc-input-border-color);
			}
			sc-toggle {
				--sc-toggle-header-padding: var(--sc-toggle-padding) 0;
				--sc-toggle-content-padding: 0;
			}
			sc-toggle::part(body) {
				border-top: 0;
			}
		</style>
				<?php
			}
		);
		ob_start();
		?>

		<sc-toggle borderless>
			<span slot="summary">
				<?php if ( ! empty( $attributes['icon'] ) ) : ?>
					<sc-icon name="<?php echo esc_attr( $attributes['icon'] ); ?>" style="font-size: 18px"></sc-icon>
				<?php endif; ?>
				<span><?php echo wp_kses_post( $attributes['heading'] ?? '' ); ?></span>
			</span>
			<?php echo filter_block_content( $content, 'post' ); ?>
		</sc-toggle>

		<?php
		return ob_get_clean();
	}
}
