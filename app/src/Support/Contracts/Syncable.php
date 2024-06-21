<?php

namespace SureCart\Support\Contracts;

interface Syncable {
	/**
	 * Sync the model.
	 *
	 * @return void
	 */
	public function sync();
}
