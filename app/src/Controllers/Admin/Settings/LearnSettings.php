<?php

namespace SureCart\Controllers\Admin\Settings;

use SureCart\Models\Product;

/**
 * Controls the Learn settings page.
 */
class LearnSettings extends BaseSettings {
	/**
	 * Script handles for pages
	 *
	 * @var array
	 */
	protected $scripts = [
		'show' => [ 'surecart/scripts/admin/learn', 'admin/settings/learn' ],
	];

	/**
	 * Enqueue a script with Learn-specific data.
	 *
	 * @param string $handle Script handle.
	 * @param string $path   Path to script.
	 * @param array  $deps   Dependencies.
	 *
	 * @return void
	 */
	public function enqueue( $handle, $path, $deps = [] ) {
		parent::enqueue( $handle, $path, $deps );
		wp_add_inline_script(
			$handle,
			'window.scData = Object.assign( window.scData || {}, ' . wp_json_encode(
				[
					'has_products' => (bool) ( Product::where( [ 'archived' => false ] )->paginate( [ 'per_page' => 1 ] )->pagination->count ?? 0 ),
				]
			) . ' );',
			'before'
		);
	}
}
