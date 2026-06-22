<?php

namespace SureCart\Models\Traits;

/**
 * Adds rule-based filtering against the resource's filter endpoints.
 *
 * These methods are protected but reachable from controllers/tests via Model::__call(),
 * the same convention as resend_notification()/finalize().
 */
trait CanFilter {
	/**
	 * Fetch the rule schema for the resource.
	 *
	 * Returns the raw rule_schema response object (attributes, types, operators).
	 *
	 * @return object|\WP_Error
	 */
	protected function filterSchema() {
		return $this->makeRequest( [ 'method' => 'GET' ], $this->endpoint . '/filter_schema' );
	}

	/**
	 * Fetch a paginated, filtered collection using a rule tree.
	 *
	 * @param array $rules      The rule tree (condition or group) to filter by.
	 * @param array $pagination Pagination args (page, per_page).
	 *
	 * @return \SureCart\Models\Collection|\WP_Error
	 */
	protected function filter( $rules = [], $pagination = [] ) {
		$this->setPagination( $pagination );

		$items = $this->makeRequest(
			[
				'method' => 'POST',
				'query'  => $this->query,
				'body'   => [ 'filter' => $rules ],
			],
			$this->endpoint . '/filter'
		);

		if ( $this->isError( $items ) ) {
			return $items;
		}

		if ( ! empty( $items->data ) ) {
			$models = [];
			foreach ( $items->data as $data ) {
				$models[] = new static( $data );
			}
			$items->data = $models;
		}

		return new \SureCart\Models\Collection( $items );
	}
}
