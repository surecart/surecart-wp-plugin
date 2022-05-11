<?php

namespace SureCart\Integrations;

interface PurchaseSyncInterface {
	/**
	 * Enable Access to the course.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 * @return boolean|void Returns true if the user course access updation was successful otherwise false.
	 */
	public function enableAccess( $purchase );

	/**
	 * Revoke Access to the course.
	 *
	 * @param \SureCart\Models\Purchase $purchase Purchase model.
	 * @return boolean|void Returns true if the user course access updation was successful otherwise false.
	 */
	public function revokeAccess( $purchase );
}
