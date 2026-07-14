<?php
namespace SureCart\Tests\Support;

use SureCart\Support\GitHubInstaller;
use SureCart\Tests\SureCartUnitTestCase;

class GitHubInstallerTest extends SureCartUnitTestCase {
	/**
	 * @group github_installer
	 */
	public function test_rejects_non_https_url() {
		$result = GitHubInstaller::resolveZipUrl( 'http://github.com/owner/repo/releases/latest/download/plugin.zip' );
		$this->assertTrue( is_wp_error( $result ) );
	}

	/**
	 * @group github_installer
	 */
	public function test_rejects_lookalike_hosts() {
		$this->assertTrue( is_wp_error( GitHubInstaller::resolveZipUrl( 'https://evil-github.com/owner/repo/x.zip' ) ) );
		$this->assertTrue( is_wp_error( GitHubInstaller::resolveZipUrl( 'https://github.com.evil.com/owner/repo/x.zip' ) ) );
	}

	/**
	 * @group github_installer
	 */
	public function test_rejects_userinfo_in_url() {
		$result = GitHubInstaller::resolveZipUrl( 'https://x@github.com@evil.com/a.zip' );
		$this->assertTrue( is_wp_error( $result ) );
	}

	/**
	 * @group github_installer
	 */
	public function test_rejects_bare_repo_url() {
		$result = GitHubInstaller::resolveZipUrl( 'https://github.com/owner/repo' );
		$this->assertTrue( is_wp_error( $result ) );
		$this->assertEquals( 'sc_not_a_zip', $result->get_error_code() );
	}

	/**
	 * @group github_installer
	 */
	public function test_passes_latest_release_asset() {
		$url    = 'https://github.com/owner/repo/releases/latest/download/plugin.zip';
		$result = GitHubInstaller::resolveZipUrl( $url );
		$this->assertEquals( $url, $result );
	}

	/**
	 * @group github_installer
	 */
	public function test_passes_tag_release_asset() {
		$url    = 'https://github.com/owner/repo/releases/download/v1.2.3/plugin.zip';
		$result = GitHubInstaller::resolveZipUrl( $url );
		$this->assertEquals( $url, $result );
	}

	/**
	 * The allow-list host check accepts the CDN hosts that release assets redirect to.
	 *
	 * @group github_installer
	 */
	public function test_is_allowed_host_accepts_release_cdn_hosts() {
		$this->assertTrue( GitHubInstaller::isAllowedHost( 'github.com' ) );
		$this->assertTrue( GitHubInstaller::isAllowedHost( 'codeload.github.com' ) );
		$this->assertTrue( GitHubInstaller::isAllowedHost( 'objects.githubusercontent.com' ) );
		$this->assertTrue( GitHubInstaller::isAllowedHost( 'release-assets.githubusercontent.com' ) );
		// Case-insensitive.
		$this->assertTrue( GitHubInstaller::isAllowedHost( 'GitHub.com' ) );
	}

	/**
	 * The allow-list host check rejects lookalike and unrelated hosts.
	 *
	 * @group github_installer
	 */
	public function test_is_allowed_host_rejects_other_hosts() {
		$this->assertFalse( GitHubInstaller::isAllowedHost( 'evil.com' ) );
		$this->assertFalse( GitHubInstaller::isAllowedHost( 'github.com.evil.com' ) );
		$this->assertFalse( GitHubInstaller::isAllowedHost( 'evil-github.com' ) );
		$this->assertFalse( GitHubInstaller::isAllowedHost( '127.0.0.1' ) );
	}
}
