<?php

namespace CheckoutEngine\Controllers\Admin\Forms;

use CheckoutEngine\Models\Form;
use CheckoutEngine\Models\Product;
use CheckoutEngine\Support\TimeDate;
use CheckoutEngine\Controllers\Admin\Tables\ListTable;

/**
 * Create a new table class that will extend the WP_List_Table
 */
class FormListTable extends ListTable {
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
				'total_items' => count( $query ),
				'per_page'    => $this->get_items_per_page( 'abandoned_checkouts' ),
			]
		);

		$this->items = $query;
	}

	/**
	 * Override the parent columns method. Defines the columns to use in your listing table
	 *
	 * @return Array
	 */
	public function get_columns() {
		return [
			'name'     => __( 'Name', 'checkout_engine' ),
			'posts'    => __( 'Posts', 'checkout_engine' ),
			'products' => __( 'Products', 'checkout_engine' ),
		];
	}

	/**
	 * Get the table data
	 *
	 * @return Array
	 */
	protected function table_data() {
		return get_posts(
			[
				'post_type' => 'ce_form',
				'limit'     => $this->get_items_per_page( 'forms' ),
				'page'      => $this->get_pagenum(),
			]
		);
	}

	/**
	 * Handle the total column
	 *
	 * @param \CheckoutEngine\Models\Form $checkout Checkout Session Model.
	 *
	 * @return string
	 */
	public function column_name( $form ) {
		return '<a href="' . esc_url( get_edit_post_link( $form ) ) . '">' . wp_kses_post( get_the_title( $form ) ) . '</a>';
	}

	public function column_posts( $form ) {
		$posts = Form::getPosts( $form->ID );

		$post_names = array_map(
			function ( $post ) {
				return '<a href="' . get_edit_post_link( $post->ID ) . '">' . $post->post_title . '</a>';
			},
			$posts,
		);

		return implode( ', ', $post_names );
	}

	public function column_products( $form ) {
		$products = Form::getProducts( $form );

		$product_names = array_map(
			function ( $product ) {
				return $product->name;
			},
			$products,
		);

		return implode( ', ', $product_names );
	}

	/**
	 * Handle the total column
	 *
	 * @param \CheckoutEngine\Models\Form $abandoned Abandoned checkout model.
	 *
	 * @return string
	 */
	public function column_date( $abandoned ) {
		return sprintf(
			'<time datetime="%1$s" title="%2$s">%3$s</time>',
			esc_attr( $abandoned->latest_checkout_session->updated_at ),
			esc_html( TimeDate::formatDateAndTime( $abandoned->latest_checkout_session->updated_at ) ),
			esc_html( TimeDate::humanTimeDiff( $abandoned->latest_checkout_session->updated_at ) )
		);
	}

	/**
	 * Handle the status
	 *
	 * @param \CheckoutEngine\Models\Form $abandoned Abandoned checkout session.
	 *
	 * @return string
	 */
	public function column_status( $abandoned ) {
		switch ( $abandoned->status ) {
			case 'not_notified':
				return '<ce-tag type="danger">' . __( 'Not Notified', 'checkout_engine' ) . '</ce-tag>';
			case 'notified':
				return '<ce-tag type="warning">' . __( 'Notified', 'checkout_engine' ) . '</ce-tag>';
			case 'recovered':
				return '<ce-tag type="success">' . __( 'Recovered', 'checkout_engine' ) . '</ce-tag>';
		}
		return '<ce-tag>' . $abandoned->status . '</ce-tag>';
	}

	/**
	 * Email of customer
	 *
	 * @param \CheckoutEngine\Models\Form $abandoned Abandoned checkout model.
	 *
	 * @return string
	 */
	public function column_email( $abandoned ) {
		return $abandoned->customer->email;
	}
}
