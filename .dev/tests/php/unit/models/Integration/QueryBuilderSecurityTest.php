<?php

namespace SureCart\Tests\Models;

use SureCart\Models\Integration;
use SureCart\Tests\SureCartUnitTestCase;

/**
 * Regression coverage for the wp-query-builder SQL injection disclosed in
 * Tenable TRA-690 (see Linear SUR-5139).
 *
 * Prior to the fix, values containing a `.` or the WP table prefix substring
 * bypassed `$wpdb->prepare()` entirely and were concatenated raw into the
 * WHERE clause, enabling authenticated UNION-based extraction. These tests
 * lock in the corrected escaping behavior and the DatabaseModel fillable-key
 * guard that blocks identifier injection via array keys.
 *
 * @group query-builder-security
 */
class QueryBuilderSecurityTest extends SureCartUnitTestCase {
	public function setUp() : void {
		parent::setUp();
		\SureCart::make()->bootstrap( [
			'providers' => [
				\SureCart\Database\MigrationsServiceProvider::class,
			],
		], false );

		Integration::create( [
			'model_id'       => 'product_1',
			'integration_id' => 1,
			'model_name'     => 'product',
			'provider'       => 'internal',
		] );
		Integration::create( [
			'model_id'       => 'product_2',
			'integration_id' => 2,
			'model_name'     => 'product',
			'provider'       => 'internal',
		] );
	}

	/**
	 * A plaintext string value that happens to look like a column identifier
	 * (e.g. `product_1`, `testmodel`, `stripe`) must be prepared, not passed
	 * through as a raw identifier. This guards against over-tightening the
	 * escape bypass into a different regression — only explicit `table.col`
	 * references should pass through raw.
	 */
	public function test_plain_string_value_is_prepared_and_matches_row() {
		$result = Integration::where( 'model_id', 'product_1' )->get();
		$this->assertNotInstanceOf( \WP_Error::class, $result );
		$this->assertCount( 1, $result );
		$this->assertSame( 'product_1', $result[0]->model_id );
	}

	/**
	 * A value containing a dot must be prepared, not passed through raw. Prior
	 * to the fix, "1.0" would short-circuit prepare() and be concatenated raw.
	 */
	public function test_dot_value_is_prepared_not_bypassed() {
		$result = Integration::where( 'integration_id', '1.0' )->get();
		$this->assertNotInstanceOf( \WP_Error::class, $result );
		$this->assertCount( 1, $result );
		$this->assertSame( 1, (int) $result[0]->integration_id );
	}

	/**
	 * A value matching the WP table prefix substring must not bypass prepare().
	 */
	public function test_prefix_substring_value_is_prepared() {
		$result = Integration::where( 'model_id', 'wp_users' )->get();
		$this->assertNotInstanceOf( \WP_Error::class, $result );
		$this->assertCount( 0, $result );
	}

	/**
	 * A UNION-based SQL injection payload must be treated as an opaque string
	 * and return no rows — no password hashes leaked. Replays the reporter's
	 * PoC from REPORT.md §4.2.
	 */
	public function test_union_payload_is_neutralized() {
		$payload = '0 UNION SELECT 1,user_login,user_email,4,5,6,user_pass,8,9,1.0 FROM ' . $GLOBALS['wpdb']->users . '--';
		$result  = Integration::where( 'model_name', $payload )->get();
		$this->assertNotInstanceOf( \WP_Error::class, $result );
		$this->assertCount( 0, $result, 'Injection payload must not return rows from wp_users.' );
	}

	/**
	 * Each element of an `IN (...)` list must be prepared. Prior to the fix,
	 * array elements were interpolated raw — quotes in values broke out of
	 * the constructed string.
	 */
	public function test_wherein_array_elements_are_prepared() {
		$result = Integration::whereIn( 'integration_id', [ '1.0', '2.0' ] )->get();
		$this->assertNotInstanceOf( \WP_Error::class, $result );
		$this->assertCount( 2, $result );
	}

	/**
	 * An element of an `IN (...)` list containing a quote-break payload must
	 * not escape the quoted context.
	 */
	public function test_wherein_quote_break_is_neutralized() {
		$result = Integration::whereIn( 'model_id', [ 'product_1', 'a") OR 1=1 --' ] )->get();
		$this->assertNotInstanceOf( \WP_Error::class, $result );
		$this->assertCount( 1, $result );
		$this->assertSame( 'product_1', $result[0]->model_id );
	}

	/**
	 * Non-fillable keys in an associative `where()` argument must be dropped
	 * by `DatabaseModel::filterWhereColumns()` — identifier injection would
	 * otherwise sneak past the value-escape layer entirely.
	 */
	public function test_non_fillable_array_keys_are_dropped() {
		$result = Integration::where( [
			'model_id'                => 'product_1',
			'evil_col --" OR 1=1 --' => 'anything',
		] )->get();
		$this->assertNotInstanceOf( \WP_Error::class, $result );
		$this->assertCount( 1, $result );
		$this->assertSame( 'product_1', $result[0]->model_id );
	}

	/**
	 * If every supplied key is non-fillable the filtered array becomes empty
	 * and the query must not error out or leak rows from an unrelated table.
	 */
	public function test_all_non_fillable_keys_drop_to_empty_filter() {
		$result = Integration::where( [
			'evil; DROP TABLE --' => 'x',
		] )->get();
		$this->assertNotInstanceOf( \WP_Error::class, $result );
		// No WHERE clauses → all seeded rows returned; the point is the
		// absence of an injected identifier, not the row count itself.
		$this->assertCount( 2, $result );
	}

	/**
	 * Multi-segment identifiers like `schema.table.column` or an attacker's
	 * crafted `a.b.c` must NOT match the identifier regex — only a single
	 * `table.column` form is permitted through raw.
	 */
	public function test_multi_segment_identifier_is_prepared() {
		$result = Integration::where( 'model_id', 'schema.users.id' )->get();
		$this->assertNotInstanceOf( \WP_Error::class, $result );
		$this->assertCount( 0, $result, 'Multi-segment identifiers must be prepared as string values.' );
	}

	/**
	 * The 3-arg form `where('col', '=', 'value')` (scalar column name, not
	 * array) must not be touched by the DatabaseModel fillable guard. This
	 * guards against the guard being too aggressive and dropping valid calls.
	 */
	public function test_three_arg_scalar_where_is_not_filtered() {
		$result = Integration::where( 'model_id', '=', 'product_1' )->get();
		$this->assertNotInstanceOf( \WP_Error::class, $result );
		$this->assertCount( 1, $result );
		$this->assertSame( 'product_1', $result[0]->model_id );
	}

	/**
	 * A `null` value in `where()` must be rendered as the literal `null`
	 * without reaching `$wpdb->prepare()` (which would coerce it to an
	 * empty string). The query builds `col = null`, which in MySQL
	 * evaluates to unknown for every row — the invariant we lock in is
	 * "no SQL error, no rows" rather than the specific match count.
	 */
	public function test_null_value_does_not_crash_query() {
		$result = Integration::where( 'deleted_at', null )->get();
		$this->assertNotInstanceOf( \WP_Error::class, $result );
		$this->assertIsArray( $result );
		$this->assertCount( 0, $result );
	}

	/**
	 * Instance-level `$model->where([ ... ])` (through `__call`) must apply
	 * the same fillable-key guard as the static `Integration::where([...])`
	 * path (through `__callStatic`). Regression guard for future refactors
	 * that might move the guard to only one of the two magic dispatchers.
	 */
	public function test_instance_where_also_filters_non_fillable_keys() {
		$model  = new Integration();
		$result = $model->where( [
			'model_id'                => 'product_1',
			'evil_col --" OR 1=1 --' => 'x',
		] )->get();
		$this->assertNotInstanceOf( \WP_Error::class, $result );
		$this->assertCount( 1, $result );
		$this->assertSame( 'product_1', $result[0]->model_id );
	}
}
