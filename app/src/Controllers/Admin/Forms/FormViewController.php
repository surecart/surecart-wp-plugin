<?php

namespace CheckoutEngine\Controllers\Admin\Forms;

use CheckoutEngine\Controllers\Admin\Forms\FormListTable;

class FormViewController {
	public function index() {
		$table = new FormListTable();
		$table->prepare_items();
		return \CheckoutEngine::view( 'admin.forms.index' )->with(
			[
				'table' => $table,
			]
		);
	}
}
