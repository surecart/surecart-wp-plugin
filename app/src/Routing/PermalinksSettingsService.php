<?php

namespace SureCart\Routing;

/**
 * Permalinks settings service.
 */
class PermalinksSettingsService {
	/**
	 * Permalink settings.
	 *
	 * @var array
	 */
	private $permalinks = [];

	/**
	 * Get the current values of the permalinks.
	 */
	public function __construct() {
		$this->permalinks = $this->getPermalinkSettings();
	}

	/**
	 * Add section to permlinks page.
	 */
	public function bootstrap() {
		add_action( 'admin_init', [ $this, 'addSettingsSections' ] );
		add_action( 'admin_init', [ $this, 'maybeSaveSettings' ] );
	}

	/**
	 * Add sections to permalinks page.
	 */
	public function addSettingsSections() {
		add_settings_section( 'surecart-buy-permalink', __( 'Buy Page Permalinks', 'surecart' ), array( $this, 'buyPageSettings' ), 'permalink' );
	}

	/**
	 * Add input to permalinks page.
	 *
	 * @return void
	 */
	public function buyPageSettings() {
		/* translators: %s: Home URL */
		echo wp_kses_post( wpautop( sprintf( __( 'If you like, you may enter custom structures for your buy link URLs here. For example, using <code>buy</code> would make your product buy links like <code>%sbuy/sample-product/</code>.', 'surecart' ), esc_url( home_url( '/' ) ) ) ) );
		?>

		<table class="form-table sc-permalink-structure">
			<tbody>
				<tr>
					<th><label><input name="buy_permalink" type="radio" value="buy" class="sctog" <?php checked( _x( 'buy', 'buy-page-slug', 'surecart' ), $this->permalinks['buy_page'] ); ?> /> <?php esc_html_e( 'Default', 'surecart' ); ?></label></th>
					<td><code><?php echo esc_html( home_url() ); ?>/buy/sample-product/</code></td>
				</tr>
				<tr>
					<th><label><input name="buy_permalink" type="radio" value="purchase" class="sctog" <?php checked( _x( 'purchase', 'buy-page-slug', 'surecart' ), $this->permalinks['buy_page'] ); ?> /> <?php esc_html_e( 'Purchase', 'surecart' ); ?></label></th>
					<td><code><?php echo esc_html( home_url() ); ?>/purchase/sample-product/</code></td>
				</tr>
				<tr>
					<th><label><input name="buy_permalink" id="surecart_custom_selection" type="radio" value="custom" class="tog" <?php checked( in_array( $this->permalinks['buy_page'], [ _x( 'buy', 'buy-page-slug', 'surecart' ), _x( 'purchase', 'buy-page-slug', 'surecart' ) ], true ), false ); ?> />
					<?php esc_html_e( 'Custom base', 'surecart' ); ?></label></th>
					<td>
						<input name="buy_permalink_structure" id="surecart_permalink_structure" type="text" value="<?php echo esc_attr( ! in_array( $this->permalinks['buy_page'], [ _x( 'buy', 'buy-page-slug', 'surecart' ), _x( 'purchase', 'buy-page-slug', 'surecart' ) ], true ) ? trailingslashit( $this->permalinks['buy_page'] ) : '' ); ?>" class="regular-text code"> <span class="description"><?php esc_html_e( 'Enter a custom base to use. A base must be set or WordPress will use default instead.', 'surecart' ); ?></span>
					</td>
				</tr>
			</tbody>
		</table>

		<?php wp_nonce_field( 'surecart-permalinks', 'surecart-permalinks-nonce' ); ?>

		<script type="text/javascript">
			jQuery( function() {
				jQuery('input.sctog').on( 'change', function() {
					jQuery('#surecart_permalink_structure').val( jQuery( this ).val() );
				});
				jQuery('.sc-permalink-structure input:checked').trigger( 'change' );
				jQuery('#surecart_permalink_structure').on( 'focus', function(){
					jQuery('#surecart_custom_selection').trigger( 'click' );
				} );
			} );
		</script>

		<?php
	}

	/**
	 * Save the settings.
	 */
	public function maybeSaveSettings() {
		if ( ! is_admin() ) {
			return;
		}

		// we must have our permalink post data and nonce.
		if ( ! isset( $_POST['buy_permalink_structure'], $_POST['buy_permalink'] ) || ! wp_verify_nonce( wp_unslash( $_POST['surecart-permalinks-nonce'] ), 'surecart-permalinks' ) ) { // WPCS: input var ok, sanitization ok.
			return;
		}

		// get the buy base.
		$buy_page = isset( $_POST['buy_permalink'] ) ? sanitize_text_field( wp_unslash( $_POST['buy_permalink'] ) ) : '';

		if ( 'custom' === $buy_page ) {
			$buy_page = ! empty( $_POST['buy_permalink_structure'] ) ? preg_replace( '#/+#', '/', '/' . str_replace( '#', '', trim( wp_unslash( $_POST['buy_permalink_structure'] ) ) ) ) : _x( 'buy', 'buy-page-slug', 'surecart' ); // WPCS: input var ok, sanitization ok.
		} elseif ( empty( $buy_page ) ) {
			$buy_page = _x( 'buy', 'buy-page-slug', 'surecart' );
		}

		$this->permalinks['buy_page'] = sanitize_title( $buy_page );

		$this->updatePermalinkSettings();
	}

	/**
	 * Get the permalink settings.
	 *
	 * @return array
	 */
	public function getPermalinkSettings() {
		$settings = (array) get_option( 'surecart_permalinks', [] );
		return wp_parse_args(
			$settings,
			[
				'buy_page' => _x( 'buy', 'buy-page-slug', 'surecart' ),
			]
		);
	}

	/**
	 * Update the permalink settings.
	 *
	 * @param array $value The value to update.
	 *
	 * @return bool
	 */
	public function updatePermalinkSettings() {
		return update_option( 'surecart_permalinks', $this->permalinks );
	}

	/**
	 * Get get the base for a slug.
	 *
	 * @param string $slug The slug of the base.
	 *
	 * @return string
	 */
	public function getBase( $slug ) {
		return $this->permalinks[ $slug ] ?? '';
	}
}
