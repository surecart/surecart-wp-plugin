<?php

namespace SureCart\Controllers\Admin\Tables;

use SureCart\Models\Integration;
use SureCart\Support\TimeDate;

// WP_List_Table is not loaded automatically so we need to load it in our application.
if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

/**
 * Base list table class.
 */
abstract class ListTable extends \WP_List_Table {
	public $checkbox = true;

	/**
	 * Show filters in extra tablenav top
	 *
	 * @param [type] $which
	 * @return void
	 */
	protected function extra_tablenav( $which ) {
		if ( 'top' === $which ) {
			return $this->views();
		}
	}

	/**
	 * Define which columns are hidden
	 *
	 * @return Array
	 */
	public function get_hidden_columns() {
		return array();
	}

	/**
	 * Get the archive query status.
	 *
	 * @return boolean|null
	 */
	public function getArchiveStatus( $default = 'active' ) {
		$status   = sanitize_text_field( wp_unslash( $_GET['status'] ?? $default ) );
		$archived = false;
		if ( 'archived' === $status ) {
			$archived = true;
		}
		if ( 'all' === $status ) {
			$archived = null;
		}

		return $archived;
	}

	/**
	 * Handle the date
	 *
	 * @param \SureCart\Models\Model $model Model.
	 *
	 * @return string
	 */
	public function column_date( $model ) {
		if ( $model->created_at === $model->updated_at ) {
			// translators: %s: created at date.
			return sprintf( 'Published %s', $model->created_at_date );
		}

		return sprintf(
			// translators: %s: updated at date.
			'Last Modified %s',
			$model->updated_at_date
		);
	}

	/**
	 * Handle the created column
	 *
	 * @param \SureCart\Models\Model $model Model.
	 *
	 * @return string
	 */
	public function column_created( $model ) {
		return $model->created_at_date;
	}

	/**
	 * The mode for the model.
	 *
	 * @param SureCart\Model $model Model.
	 *
	 * @return string
	 */
	public function column_mode( $model ) {
		return empty( $model->live_mode ) ? '<sc-tag type="warning">' . __( 'Test', 'surecart' ) . '</sc-tag>' : '';
	}

	/**
	 * Show an integrations list based on a product id.
	 *
	 * @param string $args The args.
	 *
	 * @return string
	 */
	public function productIntegrationsList( $args ) {
		// parse the args.
		$args = wp_parse_args(
			$args,
			[
				'product_id' => '',
				'price_id'   => '',
				'variant_id' => '',
			]
		);

		// get the integration first by product id.
		$integrations = Integration::where( 'model_id', $args['product_id'] );

		$output       = '';
		$integrations = $integrations->group_by( 'integration_id' )->get();
		if ( empty( $integrations ) || is_wp_error( $integrations ) ) {
			return $output;
		}

		foreach ( $integrations as $integration ) {
			$provider = (object) apply_filters( "surecart/integrations/providers/find/{$integration->provider}", [] );
			$item     = (object) apply_filters( "surecart/integrations/providers/{$integration->provider}/item", $integration->integration_id );
			if ( $integration->price_id && $args['price_id'] && $integration->price_id !== $args['price_id'] ) {
				continue;
			}
			if ( $integration->variant_id && $args['variant_id'] && $integration->variant_id !== $args['variant_id'] ) {
				continue;
			}
			if ( ! empty( $item->label ) ) {
				ob_start();
				?>
				<sc-tooltip text="<?php echo esc_attr( $provider->label ?? '' ); ?>" type="text" style="display:inline-block; cursor: help">
					<sc-flex justify-content="flex-start">
					<?php if ( $provider->logo ) : ?>
							<img src="<?php echo esc_url( $provider->logo ); ?>" style="width: 18px; height: 18px"/>
						<?php endif; ?>
					<?php echo wp_kses_post( $item->label ); ?>
					</sc-flex>
				</sc-tooltip>
				<br />
				<?php
				$output .= ob_get_clean();
			}
		}
		return $output;
	}

	/**
	 * Get the search query from the url args.
	 *
	 * @return string
	 */
	public function get_search_query() {
		$search = urldecode( $_GET['s'] ?? '' );
		return str_replace( [ "\r", "\n" ], '', $search );
	}

	/**
	 * Display a search form
	 *
	 * @param string $text The 'submit' button label.
	 * @param string $input_id  ID attribute value for the search input field.
	 *
	 * @return void
	 */
	public function search_form( $text, $input_id ) {
		?>
		<form id="posts-filter" method="get">
			<?php if ( isset( $_GET['page'] ) ) : ?>
				<input type="hidden" name="page" value="<?php echo esc_attr( $_GET['page'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>">
			<?php endif; ?>
			<?php if ( isset( $_GET['status'] ) ) : ?>
				<input type="hidden" name="status" value="<?php echo esc_attr( $_GET['status'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>">
			<?php endif; ?>
			<?php $this->search_box( $text, $input_id ); ?>
		</form>
		<?php
	}
}
