<?php

namespace SureCart\Support;

/**
 * Validates GitHub-hosted plugin/theme zip URLs before they are used for installation.
 *
 * Acts as an allow-list gate so only trusted GitHub download hosts and installable
 * paths are accepted. This is a structural pre-flight check, not a replacement for
 * a runtime SSRF guard.
 */
class GitHubInstaller {
	/**
	 * Hosts that are permitted to serve installable zips.
	 *
	 * Matched exactly (lowercased) — no suffix or substring matching.
	 *
	 * @var array
	 */
	protected static $allowed_hosts = array(
		'github.com',
		'codeload.github.com',
		'objects.githubusercontent.com',
		'release-assets.githubusercontent.com',
	);

	/**
	 * Validate a URL and return a trusted GitHub zip download URL.
	 *
	 * @param string $url The candidate download URL.
	 *
	 * @return string|\WP_Error The trimmed URL on success, or a WP_Error describing the failure.
	 */
	public static function resolveZipUrl( string $url ) {
		$url = trim( $url );

		if ( empty( $url ) ) {
			return new \WP_Error( 'sc_invalid_url', __( 'Please provide a download URL.', 'surecart' ) );
		}

		// Cheap pre-filter — catches obviously malformed input before deeper checks.
		if ( ! wp_http_validate_url( $url ) ) {
			return new \WP_Error( 'sc_invalid_url', __( 'The download URL is not valid.', 'surecart' ) );
		}

		$parts = wp_parse_url( $url );

		if ( empty( $parts['scheme'] ) || 'https' !== $parts['scheme'] ) {
			return new \WP_Error( 'sc_invalid_url', __( 'The download URL must use HTTPS.', 'surecart' ) );
		}

		// Reject non-standard ports.
		if ( isset( $parts['port'] ) && 443 !== (int) $parts['port'] ) {
			return new \WP_Error( 'sc_invalid_url', __( 'The download URL must not specify a custom port.', 'surecart' ) );
		}

		// Reject embedded credentials (e.g. https://x@github.com@evil/...).
		if ( ! empty( $parts['user'] ) || ! empty( $parts['pass'] ) ) {
			return new \WP_Error( 'sc_invalid_url', __( 'The download URL must not contain user credentials.', 'surecart' ) );
		}

		if ( empty( $parts['host'] ) ) {
			return new \WP_Error( 'sc_invalid_host', __( 'The download URL host is not allowed.', 'surecart' ) );
		}

		$host = strtolower( $parts['host'] );

		if ( ! self::isAllowedHost( $host ) ) {
			return new \WP_Error( 'sc_invalid_host', __( 'Only GitHub download URLs are allowed.', 'surecart' ) );
		}

		$path = isset( $parts['path'] ) ? $parts['path'] : '';

		if ( 'github.com' === $host ) {
			$valid = self::isValidGitHubPath( $path );
			if ( is_wp_error( $valid ) ) {
				return $valid;
			}
		} else {
			$valid = self::isValidArchivePath( $path );
			if ( is_wp_error( $valid ) ) {
				return $valid;
			}
		}

		return $url;
	}

	/**
	 * Check whether a host is on the installable allow-list.
	 *
	 * Matched exactly (lowercased) — no suffix or substring matching. Exposed so
	 * the install pipeline can re-validate redirect targets against the same list.
	 *
	 * @param string $host The host to check.
	 *
	 * @return bool
	 */
	public static function isAllowedHost( string $host ): bool {
		return in_array( strtolower( $host ), self::$allowed_hosts, true );
	}

	/**
	 * Validate the path shape for a github.com download URL.
	 *
	 * Accepts release assets and any path ending in .zip; rejects bare repo URLs.
	 *
	 * @param string $path The URL path component.
	 *
	 * @return true|\WP_Error True when installable, otherwise a WP_Error.
	 */
	protected static function isValidGitHubPath( string $path ) {
		$segment = '[A-Za-z0-9._-]+';

		// /{owner}/{repo}/releases/latest/download/{file}.zip
		if ( preg_match( '#^/' . $segment . '/' . $segment . '/releases/latest/download/' . $segment . '\.zip$#', $path ) ) {
			return true;
		}

		// /{owner}/{repo}/releases/download/{tag}/{file}.zip
		if ( preg_match( '#^/' . $segment . '/' . $segment . '/releases/download/' . $segment . '/' . $segment . '\.zip$#', $path ) ) {
			return true;
		}

		// Any other github.com path that explicitly points at a .zip file.
		if ( '.zip' === strtolower( substr( $path, -4 ) ) ) {
			return true;
		}

		return new \WP_Error(
			'sc_not_a_zip',
			__( 'Please provide a GitHub release .zip URL (for example, .../releases/latest/download/plugin.zip) rather than a repository URL.', 'surecart' )
		);
	}

	/**
	 * Validate the path shape for githubusercontent.com and codeload.github.com URLs.
	 *
	 * Requires a .zip suffix, except for codeload archive paths which serve zips
	 * without an extension (e.g. /{owner}/{repo}/zip/refs/...).
	 *
	 * @param string $path The URL path component.
	 *
	 * @return true|\WP_Error True when installable, otherwise a WP_Error.
	 */
	protected static function isValidArchivePath( string $path ) {
		if ( '.zip' === strtolower( substr( $path, -4 ) ) ) {
			return true;
		}

		$segment = '[A-Za-z0-9._-]+';

		// codeload archive path: /{owner}/{repo}/zip/refs/...
		if ( preg_match( '#^/' . $segment . '/' . $segment . '/zip/#', $path ) ) {
			return true;
		}

		return new \WP_Error( 'sc_not_a_zip', __( 'The download URL must point to a .zip file.', 'surecart' ) );
	}
}
