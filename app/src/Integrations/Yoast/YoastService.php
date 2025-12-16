<?php

namespace SureCart\Integrations\Yoast;

use SureCart\Concerns\HasNoIndexRobots;

/**
 * Controls the Yoast SEO integration.
 */
class YoastService {
	use HasNoIndexRobots;

	/**
	 * Bootstrap the Yoast SEO integration.
	 *
	 * @return void
	 */
	public function bootstrap(): void {
		add_filter( 'wpseo_robots_array', [ $this, 'addNoindexForQueryVars' ] );
	}

	/**
	 * Get the noindex robots array.
	 * Yoast uses boolean values instead of strings.
	 *
	 * @return array
	 */
	protected function getNoIndexRobots(): array {
		return [
			'noindex'  => true,
			'nofollow' => true,
		];
	}
}
