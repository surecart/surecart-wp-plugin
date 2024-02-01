<?php

namespace SureCart\Controllers\Admin\Upsells;

use SureCart\Models\Upsell;
use SureCart\Support\TimeDate;
use SureCart\Controllers\Admin\Tables\ListTable;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class UpsellsListTable extends ListTable {
	public $checkbox = true;
	public $error    = '';

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
			$this->error = $query->get_error_message();
			$this->items = [];
			return;
		}

		$this->set_pagination_args(
			[
				'total_items' => $query->pagination->count,
				'per_page'    => $this->get_items_per_page( 'upsells' ),
			]
		);

		$this->items = $query->data;
	}

	/**
	 * @global int $post_id
	 * @global string $comment_status
	 * @global string $comment_type
	 */
	protected function get_views() {
		$stati = [
			'active'   => __( 'Active', 'surecart' ),
			'archived' => __( 'Archived', 'surecart' ),
			'all'      => __( 'All', 'surecart' ),
		];

		$link = admin_url( 'admin.php?page=sc-upsell-funnels' );

		foreach ( $stati as $status => $label ) {
			$current_link_attributes = '';

			if ( ! empty( $_GET['status'] ) ) {
				if ( $status === $_GET['status'] ) {
					$current_link_attributes = ' class="current" aria-current="page"';
				}
			} elseif ( 'active' === $status ) {
				$current_link_attributes = ' class="current" aria-current="page"';
			}

			$link = add_query_arg( 'status', $status, $link );

			$status_links[ $status ] = "<a href='$link'$current_link_attributes>" . $label . '</a>';
		}

		/**
		 * Filters the comment status links.
		 *
		 * @param string[] $status_links An associative array of fully-formed comment status links. Includes 'All', 'Mine',
		 *                              'Pending', 'Approved', 'Spam', and 'Trash'.
		 */
		return apply_filters( 'comment_status_links', $status_links );
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return array
	 */
	public function get_columns() {
		return [
			'name'     => __( 'Name', 'surecart' ),
			'price'    => __( 'Price', 'surecart' ),
			'priority' => __( 'Priority', 'surecart' ),
			'date'     => __( 'Date', 'surecart' ),
		];
	}

	/**
	 * Displays the checkbox column.
	 *
	 * @param Upsell $upsell The upsell model.
	 */
	public function column_cb( $upsell ) {
		?>
		<label class="screen-reader-text" for="cb-select-<?php echo esc_attr( $upsell['id'] ); ?>"><?php _e( 'Select comment', 'surecart' ); ?></label>
		<input id="cb-select-<?php echo esc_attr( $upsell['id'] ); ?>" type="checkbox" name="delete_comments[]" value="<?php echo esc_attr( $upsell['id'] ); ?>" />
		<?php
	}

	/**
	 * Get the priority column
	 *
	 * @return bool
	 */
	public function column_priority( $upsell ) {
		echo (int) $upsell->priority;
	}

	/**
	 * Define which columns are hidden
	 *
	 * @return array
	 */
	public function get_hidden_columns() {
		return array();
	}

	/**
	 * Define the sortable columns
	 *
	 * @return array
	 */
	public function get_sortable_columns() {
		return array( 'title' => array( 'title', false ) );
	}

	/**
	 * Get the table data
	 *
	 * @return array
	 */
	private function table_data() {
		return Upsell::where(
			[
				'archived' => $this->getArchiveStatus(),
				'query'    => $this->get_search_query(),
			]
		)
		->with( [ 'price', 'price.product' ] )
		->where( [ 'sort' => 'priority:desc' ] )
		->paginate(
			[
				'per_page' => $this->get_items_per_page( 'upsells' ),
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
		if ( $this->error ) {
			echo esc_html( $this->error );
			return;
		}
		echo esc_html_e( 'No upsells found.', 'surecart' );
	}

	/**
	 * Handle the type column output.
	 *
	 * @param \SureCart\Models\Upsell $upsell Upsell model.
	 *
	 * @return string
	 */
	public function column_type( $upsell ) {
		if ( $upsell->recurring ) {
			return '<sc-tag type="success">
			<div
				style="
					display: flex;
					align-items: center;
					gap: 0.5em;"
			>
				<sc-icon name="repeat"></sc-icon>
				' . esc_html__( 'Subscription', 'surecart' ) . '
			</div>
		</sc-tag>';
		}

		return '<sc-tag type="info">
		<div
			style="
				display: flex;
				align-items: center;
				gap: 0.5em;"
		>
			<sc-icon name="bookmark"></sc-icon>
			' . esc_html__( 'One-Time', 'surecart' ) . '
		</div>
	</sc-tag>';
	}

	/**
	 * Handle the status
	 *
	 * @param \SureCart\Models\Upsell $upsell Upsell model.
	 *
	 * @return string
	 */
	public function column_date( $upsell ) {
		$created = sprintf(
			'<time datetime="%1$s" title="%2$s">%3$s</time>',
			esc_attr( $upsell->created_at ),
			esc_html( TimeDate::formatDateAndTime( $upsell->created_at ) ),
			esc_html( TimeDate::humanTimeDiff( $upsell->created_at ) )
		);
		$updated = sprintf(
			'%1$s <time datetime="%2$s" title="%3$s">%4$s</time>',
			__( 'Updated', 'surecart' ),
			esc_attr( $upsell->updated_at ),
			esc_html( TimeDate::formatDateAndTime( $upsell->updated_at ) ),
			esc_html( TimeDate::humanTimeDiff( $upsell->updated_at ) )
		);
		return $created . '<br /><small style="opacity: 0.75">' . $updated . '</small>';
	}

	/**
	 * Price
	 *
	 * @param \SureCart\Models\Upsell $upsell Upsell model.
	 *
	 * @return string
	 */
	public function column_price( $upsell ) {
		if ( empty( $upsell->price->id ) ) {
			return;
		}

		$price = $upsell->price ?? null;

		ob_start();
		?>
			<strong><?php echo esc_html( $price->product->name ); ?></strong><br/>
			<sc-format-number type="currency" currency="<?php echo esc_attr( $price->currency ); ?>" value="<?php echo (float) $price->amount; ?>"></sc-format-number>
			<sc-format-interval value="<?php echo (int) $price->recurring_interval_count; ?>" interval="<?php echo esc_attr( $price->recurring_interval ); ?>"></sc-format-interval>
		<?php
		return ob_get_clean();

		return '<sc-format-number type="currency" currency="' . esc_attr( $price->currency ) . '" value="' . (float) $price->amount . '"></sc-format-number>';
	}

	/**
	 * Name column
	 *
	 * @param \SureCart\Models\Upsell $upsell Upsell model.
	 *
	 * @return string
	 */
	public function column_name( $upsell ) {
		ob_start();
		?>

	  <div>
		<a class="row-title" aria-label="<?php echo esc_attr( 'Edit Upsell', 'surecart' ); ?>" href="<?php echo esc_url( \SureCart::getUrl()->edit( 'upsell', $upsell->id ) ); ?>">
			<?php echo esc_html( $upsell->name ? $upsell->name : $upsell->price->product->name ); ?>
		</a>


		<?php
		echo $this->row_actions(
			[
				'edit' => ' <a href="' . esc_url( \SureCart::getUrl()->edit( 'upsell', $upsell->id ) ) . '" aria-label="' . esc_attr( 'Edit Upsell', 'surecart' ) . '">' . __( 'Edit', 'surecart' ) . '</a>',
				'view' => '<a href="' . esc_url( $upsell->permalink ) . '" aria-label="' . esc_attr( 'View', 'surecart' ) . '">' . esc_html__( 'View', 'surecart' ) . '</a>',
			],
		);
		?>
		</div>

		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Define what data to show on each column of the table
	 *
	 * @param \SureCart\Models\Upsell $upsell Upsell model.
	 * @param string                  $column_name - Current column name.
	 *
	 * @return mixed
	 */
	public function column_default( $upsell, $column_name ) {
		switch ( $column_name ) {
			case 'name':
				return ' < a href     = "' . \SureCart::getUrl()->edit( 'upsell', $upsell->id ) . '" > ' . $upsell->name . ' < / a > ';

			case 'name':
			case 'description':
				return $upsell->$column_name ?? '';
		}
	}
}
