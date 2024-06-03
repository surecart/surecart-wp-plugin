<?php
namespace SureCart\Tests\WordPress\Admin;

use SureCart\Tests\SureCartUnitTestCase;;
use SureCart\Routing\PermalinkService;
/**
 * Test class for the PermalinkService service.
 *
 * This class contains tests for the methods related to flushing rewrite rules based on version changes.
 */
class PermalinkServiceTest extends SureCartUnitTestCase {
    protected $service;

    /**
     * Set up the test environment before each test.
     */
    protected function setUp(): void
    {
		parent::setUp();
        $this->service = \Mockery::mock( PermalinkService::class )->makePartial();
    }

    /**
     * Provide test versions mock data.
     * 
     * @return void
     */
    public function versionData()
    {
        return [
            'Null version'   => [null, '2.7.0', true],
            'Same version'   => ['2.7.0', '2.7.0', false],
            'Lower version'  => ['2.6.0', '2.7.0', true],
            'Higher version' => ['2.7.1', '2.7.0', true]
        ];
    }

    /**
     * Tests if flush rewrite rules was successful on version change.
     * 
     * @dataProvider versionData
     * @group flush-rewrite-rules
     * 
     * @return void
     */
    public function test_flushRewriteRulesOnVersionChange( $stored_version, $plugin_version, $should_migrate ) {
        update_option( 'surecart_flush_rewrite_rules', $stored_version );
        $this->service->shouldReceive( 'getCurrentPluginVersion' )->once()->andReturn( $plugin_version );
        $result = $this->service->flushRewriteRulesOnVersionChange();
        $should_migrate ? $this->assertTrue( $result ) : $this->assertFalse( $result );
        $this->assertTrue( version_compare( $plugin_version, get_option( 'surecart_flush_rewrite_rules' ), '==' ) );
    }
}