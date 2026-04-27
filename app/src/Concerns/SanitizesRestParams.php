<?php

namespace SureCart\Concerns;

/**
 * Shared sanitization helpers for REST controllers that accept user-supplied
 * filter parameters destined for DatabaseModel-backed query builders.
 */
trait SanitizesRestParams {
	/**
	 * Coerce a user-supplied scalar filter value into a safe string or null.
	 *
	 * Returns null for null, empty-string, or any non-scalar input so that
	 * callers can filter out missing values before building a where clause.
	 *
	 * @param mixed $value Raw request value.
	 * @return string|null
	 */
	protected function sanitizeFilterParam( $value ) {
		if ( null === $value || '' === $value ) {
			return null;
		}
		if ( ! is_scalar( $value ) ) {
			return null;
		}
		return sanitize_text_field( (string) $value );
	}
}
