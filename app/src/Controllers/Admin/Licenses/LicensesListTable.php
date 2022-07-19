<?php

namespace SureCart\Controllers\Admin\Licenses;

use SureCart\Models\Product;
use SureCart\Models\License;
use SureCart\Support\Currency;
use SureCart\Support\TimeDate;
use SureCart\Controllers\Admin\Tables\ListTable;
/**
 * Create a new table class that will extend the WP_List_Table
 */
class LicensesListTable extends ListTable {
	/**
	 * Prepare the items for the table to process
	 *
	 * @return Void
	 */
	public function prepare_items() {
		$columns  = $this->get_columns();
		$hidden   = $this->get_hidden_columns();
		$sortable = $this->get_sortable_columns();

		$this->_column_headers = array( $columns, $hidden, $sortable );

		$query = $this->table_data();
		if ( is_wp_error( $query ) ) {
			$this->items = [];
			return;
		}

		$this->set_pagination_args(
			[
				'total_items' => $query->pagination->count,
				'per_page'    => $this->get_items_per_page( 'surecart_licenses' ),
			]
		);

		$this->items = $query->data;
	}

	public function search() { ?>
	<form class="search-form"
		method="get">
		<?php $this->search_box( __( 'Search Licenses' ), 'user' ); ?>
		<input type="hidden"
			name="id"
			value="1" />
	</form>
		<?php
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return Array
	 */
	public function get_columns() {
		return [
			'key'     => __( 'Key', 'surecart' ),
			'created' => __( 'Created', 'surecart' ),
			'mode'    => '',
		];
	}

	/**
	 * Get the table data
	 *
	 * @return Array
	 */
	private function table_data() {
		return License::with( [ 'purchase', 'purchase.license' ] )
		->paginate(
			[
				'per_page' => $this->get_items_per_page( 'surecart_licenses' ),
				'page'     => $this->get_pagenum(),
			]
		);
	}

	/**
	 * Nothing found.
	 *
	 * @return void
	 */
	public function no_items() {
		echo esc_html_e( 'No licenses found.', 'surecart' );
	}

	/**
	 * Name column
	 *
	 * @param \SureCart\Models\License $license License model.
	 *
	 * @return string
	 */
	public function column_key( $license ) {
		ob_start();
		?>
		<a class="row-title" aria-label="<?php echo esc_attr( 'Edit License', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( 'licenses', $license->id ) ); ?>">
			<?php echo wp_kses_post( $license->key ); ?>
		</a>

		<?php
		echo $this->row_actions(
			[
				'edit' => '<a href="' . esc_url( \SureCart::getUrl()->edit( 'licenses', $license->id ) ) . '" aria-label="' . esc_attr( 'Edit License', 'surecart' ) . '">' . __( 'Edit', 'surecart' ) . '</a>',
			],
		);
		?>

		<?php
		return ob_get_clean();
	}

	/**
	 * Toggle archive action link and text.
	 *
	 * @param \SureCart\Models\Product $product Product model.
	 * @return string
	 */
	public function action_toggle_archive( $product ) {
		$text            = $product->archived ? __( 'Un-Archive', 'surecart' ) : __( 'Archive', 'surecart' );
		$confirm_message = $product->archived ? __( 'Are you sure you want to restore this product? This will be be available to purchase.', 'surecart' ) : __( 'Are you sure you want to archive this product? This will be unavailable for purchase.', 'surecart' );
		$link            = \SureCart::getUrl()->toggleArchive( 'product', $product->id );

		return sprintf(
			'<a class="submitdelete" onclick="return confirm(\'%1s\')" href="%2s" aria-label="%3s">%4s</a>',
			esc_attr( $confirm_message ),
			esc_url( $link ),
			esc_attr__( 'Toggle Product Archive', 'surecart' ),
			esc_html( $text )
		);
	}

	/**
	 * Define what data to show on each column of the table
	 *
	 * @param \SureCart\Models\Product $product Product model.
	 * @param String                   $column_name - Current column name.
	 *
	 * @return Mixed
	 */
	public function column_default( $product, $column_name ) {
		switch ( $column_name ) {
			case 'name':
				return '<a href="' . \SureCart::getUrl()->edit( 'product', $product->id ) . '">' . $product->name . '</a>';
			case 'name':
			case 'description':
				return $product->$column_name ?? '';
		}
	}
}
