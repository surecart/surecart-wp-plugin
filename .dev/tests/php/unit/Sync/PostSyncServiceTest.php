<?php

namespace SureCart\Tests\Sync;

use SureCart\Sync\PostSyncService;
use SureCart\Tests\SureCartUnitTestCase;

class PostSyncServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 *
	 * Factory inserts and WP_Query fire globally-hooked services (post types,
	 * taxonomies) that resolve container aliases, so bootstrap the full set.
	 */
	public function setUp(): void {
		\SureCart::make()->bootstrap(
			[
				'providers' => [
					\SureCartAppCore\AppCore\AppCoreServiceProvider::class,
					\SureCartAppCore\Config\ConfigServiceProvider::class,
					\SureCartAppCore\Assets\AssetsServiceProvider::class,
					\SureCart\Database\MigrationsServiceProvider::class,
					\SureCart\Background\BackgroundServiceProvider::class,
					\SureCart\Settings\SettingsServiceProvider::class,
					\SureCart\WordPress\Taxonomies\TaxonomyServiceProvider::class,
					\SureCart\Request\RequestServiceProvider::class,
					\SureCart\Account\AccountServiceProvider::class,
					\SureCart\Sync\SyncServiceProvider::class,
					\SureCart\WordPress\PostTypes\PostTypeServiceProvider::class,
					\SureCart\WordPress\Pages\PageServiceProvider::class,
				],
			],
			false
		);
		parent::setUp();
	}

	/**
	 * Create a synced product post.
	 *
	 * @param string $model_id The SureCart model id.
	 * @param array  $args     Extra post args.
	 *
	 * @return int Post ID.
	 */
	protected function createProductPost( $model_id, $args = [] ) {
		return self::factory()->post->create(
			array_merge(
				[
					'post_type'  => 'sc_product',
					'meta_input' => [ 'sc_id' => $model_id ],
				],
				$args
			)
		);
	}

	/**
	 * Primed lookups must not run any additional queries.
	 *
	 * @group post-sync
	 */
	public function test_primed_lookups_run_no_additional_queries() {
		$ids   = [ 'prod_a', 'prod_b', 'prod_c' ];
		$posts = [];
		foreach ( $ids as $id ) {
			$posts[ $id ] = $this->createProductPost( $id );
		}

		$service = new PostSyncService();
		$service->primeByModelIds( $ids );

		$queries_before = get_num_queries();
		foreach ( $ids as $id ) {
			$post = $service->findByModelId( $id );
			$this->assertSame( $posts[ $id ], $post->ID );
		}
		$this->assertSame( 0, get_num_queries() - $queries_before, 'Primed lookups should be query-free.' );
	}

	/**
	 * Missing ids are memoized as null by the prime, so repeat lookups are free.
	 *
	 * @group post-sync
	 */
	public function test_prime_memoizes_missing_ids_as_null() {
		$service = new PostSyncService();
		$service->primeByModelIds( [ 'prod_missing' ] );

		$queries_before = get_num_queries();
		$this->assertNull( $service->findByModelId( 'prod_missing' ) );
		$this->assertSame( 0, get_num_queries() - $queries_before );
	}

	/**
	 * Un-primed lookups fall back to a single query, then memoize.
	 *
	 * @group post-sync
	 */
	public function test_unprimed_lookup_queries_once_then_memoizes() {
		$post_id = $this->createProductPost( 'prod_solo' );
		$service = new PostSyncService();

		$queries_before = get_num_queries();
		$first          = $service->findByModelId( 'prod_solo' );
		$first_queries  = get_num_queries() - $queries_before;

		$queries_before = get_num_queries();
		$second         = $service->findByModelId( 'prod_solo' );

		$this->assertSame( $post_id, $first->ID );
		$this->assertSame( $post_id, $second->ID );
		$this->assertGreaterThan( 0, $first_queries, 'Cache miss should hit the database.' );
		$this->assertSame( 0, get_num_queries() - $queries_before, 'Repeat lookup should be memoized.' );
	}

	/**
	 * Only sc_product posts are returned, even if another type shares the meta.
	 *
	 * @group post-sync
	 */
	public function test_prime_is_scoped_to_the_post_type() {
		self::factory()->post->create(
			[
				'post_type'  => 'post',
				'meta_input' => [ 'sc_id' => 'prod_scoped' ],
			]
		);

		$service = new PostSyncService();
		$service->primeByModelIds( [ 'prod_scoped' ] );

		$this->assertNull( $service->findByModelId( 'prod_scoped' ) );
	}

	/**
	 * The map holds until flushed — this is why create/update/delete refresh it.
	 *
	 * @group post-sync
	 */
	public function test_flush_clears_stale_memoized_entries() {
		$service = new PostSyncService();
		$service->primeByModelIds( [ 'prod_late' ] );
		$this->assertNull( $service->findByModelId( 'prod_late' ) );

		// Post appears after the null was memoized (e.g. another process synced).
		$post_id = $this->createProductPost( 'prod_late' );
		$this->assertNull( $service->findByModelId( 'prod_late' ), 'Memoized null holds by design.' );

		PostSyncService::flushMemoizedPosts();
		$this->assertSame( $post_id, $service->findByModelId( 'prod_late' )->ID );
	}

	/**
	 * Empty ids never query.
	 *
	 * @group post-sync
	 */
	public function test_empty_id_returns_null_without_querying() {
		$service        = new PostSyncService();
		$queries_before = get_num_queries();

		$this->assertNull( $service->findByModelId( '' ) );
		$this->assertNull( $service->findByModelId( null ) );
		$this->assertSame( 0, get_num_queries() - $queries_before );
	}
}
