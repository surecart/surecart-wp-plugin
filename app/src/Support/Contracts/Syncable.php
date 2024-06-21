<?php

namespace SureCart\Support\Contracts;

interface Syncable {
	/**
	 * Sync the model.
	 *
	 * @param array $args Arguments.
	 *
	 * @return void
	 */
	public function sync( $args = [] );
}
