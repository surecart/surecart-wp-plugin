<?php

namespace SureCart\Models\Traits;

use SureCart\Models\RefundItem;

/**
 * If the model has refund items.
 */
trait HasRefundItems {
	/**
	 * Set the refund items attribute
	 *
	 * @param  object $value Refund item data array.
	 * @return void
	 */
	public function setRefundItemsAttribute( $value ) {
		$this->setCollection( 'refund_items', $value, RefundItem::class );
	}

	/**
	 * Does this have refund items?
	 *
	 * @return boolean
	 */
	public function hasRefundItems() {
		return count( $this->attributes['refund_items'] ?? [] ) > 0;
	}
}
