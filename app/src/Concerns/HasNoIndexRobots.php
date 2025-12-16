<?php

namespace SureCart\Concerns;

/**
 * Trait for SEO robots meta tag handling.
 */
trait HasNoIndexRobots {
	/**
	 * Modify robots to add noindex for SureCart query vars.
	 *
	 * @param array $robots Robots array.
	 *
	 * @return array Modified robots.
	 */
	public function addNoindexForQueryVars( array $robots ): array {
		if ( sc_has_no_index_query_vars() ) {
			return $this->getNoIndexRobots();
		}

		return $robots;
	}

	/**
	 * Get the noindex robots array.
	 *
	 * @return array
	 */
	protected function getNoIndexRobots(): array {
		return [
			'noindex'  => 'noindex',
			'nofollow' => 'nofollow',
		];
	}
}
