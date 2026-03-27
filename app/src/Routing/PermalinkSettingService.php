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
	 * Last part of the permalink. This is used to generate the preview.
	 *
	 * @var string
	 */
	protected $sample_preview_text = '';

	/**
	 * Build the permalink setting.
	 *
	 * @param array $args The arguments.
	 */
	public function __construct( $args = [] ) {
		$this->slug                = $args['slug'] ?? '';
		$this->label               = $args['label'] ?? '';
		$this->description         = $args['description'] ?? '';
		$this->options             = $args['options'] ?? [];
		$this->current_base        = \SureCart::settings()->permalinks()->getBase( "{$this->slug}_page" );
		$this->sample_preview_text = $args['sample_preview_text'] ?? 'sample-product';
	}

	/**
	 * Boostrap settings.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_init', [ $this, 'settingsInit' ] );
	}

	/**
	 * Add translations.
	 *
	 * @return void
	 */
	public function addTranslations() {
		$translations['surecart.settings.permalinks.product'] = [
			'slug'        => 'product',
			'label'       => __( 'SureCart Product Permalinks', 'surecart' ),
			/* translators: %s: Home URL */
			'description' => sprintf( __( 'If you like, you may enter custom structures for your product page URLs here. For example, using <code>products</code> would make your product buy links like <code>%sproducts/sample-product/</code>.', 'surecart' ), esc_url( home_url( '/' ) ) ),
			'options'     => [
				[
					'value' => 'products',
					'label' => __( 'Default', 'surecart' ),
				],
				[
					'value' => 'shop',
					'label' => __( 'Shop', 'surecart' ),
				],
			],
		];

		$translations['surecart.settings.permalinks.buy'] = [
			'slug'        => 'buy',
			'label'       => __( 'SureCart Instant Checkout Permalinks', 'surecart' ),
			/* translators: %s: Home URL */
			'description' => sprintf( __( 'If you like, you may enter custom structures for your instant checkout URLs here. For example, using <code>buy</code> would make your product buy links like <code>%sbuy/sample-product/</code>.', 'surecart' ), esc_url( home_url( '/' ) ) ),
			'options'     => [
				[
					'value' => 'buy',
					'label' => __( 'Default', 'surecart' ),
				],
				[
					'value' => 'purchase',
					'label' => __( 'Purchase', 'surecart' ),
				],
				[
					'value' => 'shop/%sc_collection%',
					'label' => __( 'Shop base with collection', 'surecart' ),
				],
			],
		];

		$translations['surecart.settings.permalinks.buy'] = [
			'slug'        => 'buy',
			'label'       => __( 'SureCart Instant Checkout Permalinks', 'surecart' ),
			/* translators: %s: Home URL */
			'description' => sprintf( __( 'If you like, you may enter custom structures for your instant checkout URLs here. For example, using <code>buy</code> would make your product buy links like <code>%sbuy/sample-product/</code>.', 'surecart' ), esc_url( home_url( '/' ) ) ),
			'options'     => [
				[
					'value' => 'buy',
					'label' => __( 'Default', 'surecart' ),
				],
				[
					'value' => 'purchase',
					'label' => __( 'Purchase', 'surecart' ),
				],
			],
		];

		$translations['surecart.settings.permalinks.collection'] = [
			'slug'                => 'collection',
			'label'               => __( 'SureCart Product Collection Permalinks', 'surecart' ),
			/* translators: %s: Home URL */
			'description'         => sprintf( __( 'If you like, you may enter custom structures for your product page URLs here. For example, using <code>collections</code> would make your product collection links like <code>%scollections/sample-collection/</code>.', 'surecart' ), esc_url( home_url( '/' ) ) ),
			'options'             => [
				[
					'value' => 'collections',
					'label' => __( 'Default', 'surecart' ),
				],
				[
					'value' => 'product-collections',
					'label' => __( 'Product Collections', 'surecart' ),
				],
			],
			'sample_preview_text' => 'sample-collection',
		];

		$translations['surecart.settings.permalinks.upsell'] = [
			'slug'        => 'upsell',
			'label'       => __( 'SureCart Upsell Permalinks', 'surecart' ),
			/* translators: %s: Home URL */
			'description' => sprintf( __( 'If you like, you may enter custom structures for your upsell URLs here. For example, using <code>offers</code> would make your upsell\'s links like <code>%soffers/upsell-id/</code>.', 'surecart' ), esc_url( home_url( '/' ) ) ),
			'options'     => [
				[
					'value' => 'offer',
					'label' => __( 'Default', 'surecart' ),
				],
				[
					'value' => 'special-offer',
					'label' => __( 'Special Offer', 'surecart' ),
				],
			],
		];
	}

	/**
	 * Initialize settings.
	 */
	public function settingsInit() {
		$this->addTranslations();
		$this->addSettingsSection();
		$this->maybeSaveSettings();
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
		echo wp_kses_post( wpautop( $this->description ) );

		$values = array_values(
			array_map(
				function ( $permalink ) {
					return trailingslashit( $permalink['value'] );
				},
				$this->options
			)
		);

		?>

		<table class="form-table sc-<?php echo esc_attr( $this->slug ); ?>-permalink-structure">
			<tbody>
				<?php foreach ( $this->options as $permalink ) : ?>
				<tr>
					<th><label><input name="sc_<?php echo esc_attr( $this->slug ); ?>_permalink" type="radio" value="<?php echo esc_attr( $permalink['value'] ); ?>" class="sc-tog-<?php echo esc_attr( $this->slug ); ?>" <?php checked( $permalink['value'], $this->current_base ); ?> /> <?php echo esc_html( $permalink['label'] ); ?></label></th>
					<td><code><?php echo esc_url( trailingslashit( home_url() ) . trailingslashit( ! empty( $permalink['display'] ) ? ltrim( $permalink['display'], '/' ) : $permalink['value'] ) . $this->sample_preview_text ); ?></code></td>
				</tr>
				<?php endforeach; ?>
				<tr>
					<th>
						<label>
							<input
								name="sc_<?php echo esc_attr( $this->slug ); ?>_permalink"
								id="surecart_<?php echo esc_attr( $this->slug ); ?>_custom_selection"
								type="radio"
								value="custom"
								class="tog"
								<?php
									checked(
										in_array(
											$this->current_base,
											array_map(
												function ( $opt ) {
													return $opt['value'];
												},
												$this->options
											),
											true
										),
										false
									);
								?>
							/>
							<?php esc_html_e( 'Custom base', 'surecart' ); ?>
						</label>
					</th>
					<td>
						<input name="sc_<?php echo esc_attr( $this->slug ); ?>_permalink_structure" id="surecart_<?php echo esc_attr( $this->slug ); ?>_permalink_structure" type="text" value="<?php echo esc_attr( ! in_array( $this->current_base, [ $values ], true ) ? untrailingslashit( $this->current_base ) : '' ); ?>" class="regular-text code"> <span class="description"><?php esc_html_e( 'Enter a custom base to use. A base must be set or WordPress will use default instead.', 'surecart' ); ?></span>
					</td>
				</tr>
			</tbody>
		</table>

		<?php wp_nonce_field( 'surecart-permalinks', 'surecart-permalinks-nonce' ); ?>

		<script>
			jQuery( function() {
				jQuery('input.sc-tog-<?php echo esc_attr( $this->slug ); ?>').on( 'change', function() {
					jQuery('#surecart_<?php echo esc_attr( $this->slug ); ?>_permalink_structure').val( jQuery( this ).val() );
				});
				jQuery('.sc-<?php echo esc_attr( $this->slug ); ?>-permalink-structure input:checked').trigger( 'change' );
				jQuery('#surecart_<?php echo esc_attr( $this->slug ); ?>_permalink_structure').on( 'focus', function(){
					jQuery('#surecart_<?php echo esc_attr( $this->slug ); ?>_custom_selection').trigger( 'click' );
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

		$structure_key = 'sc_' . esc_attr( $this->slug ) . '_permalink_structure';
		$permalink_key = 'sc_' . esc_attr( $this->slug ) . '_permalink';

		// we must have our permalink post data and nonce.
		if ( ! isset( $_POST[ $structure_key ], $_POST[ $permalink_key ] ) || ! wp_verify_nonce( wp_unslash( $_POST['surecart-permalinks-nonce'] ), 'surecart-permalinks' ) ) { // WPCS: input var ok, sanitization ok.
			return;
		}

		// get the buy base.
		$page        = isset( $_POST[ $permalink_key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $permalink_key ] ) ) : '';
		$page_struct = isset( $_POST[ $structure_key ] ) ? sanitize_text_field( wp_unslash( $_POST[ $structure_key ] ) ) : '';

		if ( 'custom' === $page ) {
			$page = ! empty( $_POST[ $structure_key ] ) ? preg_replace( '#/+#', '/', '/' . str_replace( '#', '', trim( wp_unslash( $_POST[ $structure_key ] ) ) ) ) : $this->options[0]['value']; // WPCS: input var ok, sanitization ok.
		} elseif ( empty( $page ) ) {
			$page = $this->options[0]['value'];
		}

		\SureCart::settings()->permalinks()->updatePermalinkSettings( $this->slug . '_page', $page );
	}
}
