<?php
namespace SureCart\Routing;

/**
 * A service for handling permalink settings on the permalinks page.
 */
class PermalinkSettingService {
	/**
	 * The slug of the setting.
	 *
	 * @var string
	 */
	protected $slug = '';

	/**
	 * The label of the setting.
	 *
	 * @var string
	 */
	protected $description = '';

	/**
	 * The label of the setting.
	 *
	 * @var string
	 */
	protected $label = '';

	/**
	 * The permalinks for the setting.
	 *
	 * @var array
	 */
	protected $options = [];

	/**
	 * Currently saved base.
	 *
	 * @var string
	 */
	protected $current_base = '';

	/**
	 * The option key.
	 *
	 * @var string
	 */
	protected $option_key = '';

	/**
	 * Build the permalink setting.
	 */
	public function __construct( $args = [] ) {
		$this->slug         = $args['slug'] ?? '';
		$this->label        = $args['label'] ?? '';
		$this->description  = $args['description'] ?? '';
		$this->options      = $args['options'] ?? [];
		$this->current_base = \SureCart::settings()->permalinks()->getBase( "{$this->slug}_page" );
	}

	/**
	 * Boostrap settings.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_init', [ $this, 'addSettingsSection' ] );
	}

	/**
	 * Add sections to permalinks page.
	 */
	public function addSettingsSection() {
		add_settings_section( "surecart-$this->slug-permalink", $this->label, [ $this, 'settings' ], 'permalink' );
	}

	/**
	 * Display the settings.
	 */
	public function settings() {
		echo wp_kses_post( wpautop( $this->description, esc_url( home_url( '/' ) ) ) );

		$values = array_values(
			array_map(
				function( $permalink ) {
					return $permalink['value'];
				},
				$this->options
			)
		);
		?>

		<table class="form-table sc-<?php echo esc_attr( $this->slug ); ?>-permalink-structure">
			<tbody>
				<?php foreach ( $this->options as $permalink ) : ?>
				<tr>
					<th><label><input name="<?php echo esc_attr( $this->slug ); ?>_permalink" type="radio" value="<?php echo esc_attr( $permalink['value'] ); ?>" class="sctog" <?php checked( $permalink['value'], $this->current_base ); ?> /> <?php echo esc_html( $permalink['label'] ); ?></label></th>
					<td><code><?php echo esc_html( home_url() ); ?>/<?php echo esc_attr( $permalink['value'] ); ?>/sample-product/</code></td>
				</tr>
				<?php endforeach; ?>
				<tr>
					<th><label><input name="<?php echo esc_attr( $this->slug ); ?>_permalink" id="surecart_<?php echo esc_attr( $this->slug ); ?>_custom_selection" type="radio" value="custom" class="tog" <?php checked( in_array( $this->current_base, [ _x( 'products', 'product-page-slug', 'surecart' ), _x( 'shop', 'product-page-slug', 'surecart' ) ], true ), false ); ?> />
					<?php esc_html_e( 'Custom base', 'surecart' ); ?></label></th>
					<td>
						<input name="<?php echo esc_attr( $this->slug ); ?>_permalink_structure" id="surecart_<?php echo esc_attr( $this->slug ); ?>_permalink_structure" type="text" value="<?php echo esc_attr( ! in_array( $this->current_base, [ $values ], true ) ? trailingslashit( $this->current_base ) : '' ); ?>" class="regular-text code"> <span class="description"><?php esc_html_e( 'Enter a custom base to use. A base must be set or WordPress will use default instead.', 'surecart' ); ?></span>
					</td>
				</tr>
			</tbody>
		</table>

		<?php wp_nonce_field( "surecart-{$this->slug}-permalinks", "surecart-{$this->slug}-permalinks-nonce" ); ?>

		<script>
			jQuery( function() {
				jQuery('input.sctog').on( 'change', function() {
					jQuery('#surecart_product_permalink_structure').val( jQuery( this ).val() );
				});
				jQuery('.sc-product-permalink-structure input:checked').trigger( 'change' );
				jQuery('#surecart_product_permalink_structure').on( 'focus', function(){
					jQuery('#surecart_product_custom_selection').trigger( 'click' );
				} );
			} );
		</script>
		<?php
	}

}
