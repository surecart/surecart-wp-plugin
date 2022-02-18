<?php

namespace CheckoutEngine\WordPress\Assets;

/**
 * Our assets service.
 */
class AssetsService {
	/**
	 * This adds component data to the component when it's defined at runtime.
	 *
	 * @param string $tag Tag of the web component.
	 * @param string $selector Specific selector (class or id).
	 * @param array  $data Data to add.
	 * @return void
	 */
	public function addComponentData( $tag, $selector, $data = [] ) {
		add_action(
			'wp_footer',
			function () use ( $tag, $selector, $data ) {
				return $this->outputComponentScript( $tag, $selector, $data );
			}
		);
	}

	/**
	 * Output the component initialization script.
	 *
	 * @param string $tag Tag of the web component.
	 * @param string $selector Specific selector (class or id).
	 * @param array  $data Data to add.
	 */
	public function outputComponentScript( $tag, $selector, $data = [] ) {
		?>
		<script>
			(async () => {
				await customElements.whenDefined('<?php echo esc_js( $tag ); ?>');
				var component = document.querySelector('<?php echo esc_js( $tag . $selector ); ?>');
				if (!component) return;
				<?php
				foreach ( $data as $key => $value ) {
					echo "\n";
					echo esc_js( "component.$key = " );
					echo wp_json_encode( $value );
				}
				?>
			})();
		</script>
		<?php
	}
}
