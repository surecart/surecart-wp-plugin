<?php

namespace SureCart\Tests\Models\IntegrationCatalog;

use SureCart\Models\IntegrationCatalog;
use SureCart\Tests\SureCartUnitTestCase;

class IntegrationCatalogTest extends SureCartUnitTestCase {
	/**
	 * Build an acf payload with the catalog's baseline keys, merged with overrides.
	 *
	 * The full catalog record always provides these keys; tests seed them so the
	 * source-agnostic accessors (status, activation type) do not trip on absent keys.
	 *
	 * @param array $overrides Keys to override the baseline.
	 *
	 * @return array
	 */
	protected function acf( $overrides = [] ) {
		return array_merge(
			[
				'is_pre_installed' => false,
				'plugin_slug'      => '',
				'plugin_file'      => '',
				'theme_slug'       => '',
				'activation_link'  => '',
			],
			$overrides
		);
	}

	/**
	 * A record with a github download URL reports the github source and exposes the URL.
	 *
	 * @group integration-catalog
	 */
	public function test_github_source_exposes_download_url() {
		$record = new IntegrationCatalog(
			[
				'acf' => $this->acf(
					[
						'download_url'    => 'https://github.com/owner/repo/releases/latest/download/plugin.zip',
						'github_repo_url' => 'https://github.com/owner/repo',
					]
				),
			]
		);

		$this->assertSame( 'github', $record->source );
		$this->assertSame( 'https://github.com/owner/repo/releases/latest/download/plugin.zip', $record->download_url );
		$this->assertSame( 'https://github.com/owner/repo', $record->github_repo_url );

		$serialized = $record->toArray();
		$this->assertSame( 'github', $serialized['source'] );
		$this->assertSame( 'https://github.com/owner/repo/releases/latest/download/plugin.zip', $serialized['download_url'] );
		$this->assertSame( 'https://github.com/owner/repo', $serialized['github_repo_url'] );
	}

	/**
	 * A record without a github download URL falls back to the wordpress source.
	 *
	 * @group integration-catalog
	 */
	public function test_wordpress_source_when_no_download_url() {
		$record = new IntegrationCatalog( [ 'acf' => $this->acf() ] );

		$this->assertSame( 'wordpress', $record->source );
		$this->assertNull( $record->download_url );
		$this->assertNull( $record->github_repo_url );

		$serialized = $record->toArray();
		$this->assertSame( 'wordpress', $serialized['source'] );
		$this->assertNull( $serialized['download_url'] );
		$this->assertNull( $serialized['github_repo_url'] );
	}
}
