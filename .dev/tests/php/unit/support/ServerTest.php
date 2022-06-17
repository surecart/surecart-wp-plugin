<?php
namespace SureCart\Tests\Support;

use SureCart\Support\Server;
use SureCart\Tests\SureCartUnitTestCase;

class ServerTest extends SureCartUnitTestCase {
	/**
	 * @group server
	 */
	public function test_isLocalDomain() {
		$server = new Server('http://www.example.com');
		$this->assertFalse($server->isLocalDomain());

		$server = new Server('http://www.example.test');
		$this->assertTrue($server->isLocalDomain());

		$server = new Server('http://www.example.local');
		$this->assertTrue($server->isLocalDomain());
	}

	/**
	 * @group server
	 */
	public function test_isLocalIP() {
		$server = new Server(get_site_url());

		$_SERVER['REMOTE_ADDR'] = '1.1.1.1';
		$this->assertFalse($server->isLocalIP());
		$_SERVER['REMOTE_ADDR'] = '127.0.0.1';
		$this->assertTrue($server->isLocalIP());
		$_SERVER['REMOTE_ADDR'] = '::1';
		$this->assertTrue($server->isLocalIP());
	}

	/**
	 * @group server
	 */
	public function test_isLocalHost() {
		// non-local url
		$server = new Server('localhost');
		$_SERVER['REMOTE_ADDR'] = '1.1.1.1';
		$this->assertFalse($server->isLocalHost());
		$_SERVER['REMOTE_ADDR'] = '127.0.0.1';
		$this->assertTrue($server->isLocalHost());
		$_SERVER['REMOTE_ADDR'] = '::1';
		$this->assertTrue($server->isLocalHost());

		// local url but not a local ip
		$server = new Server('http://www.example.test');
		$_SERVER['REMOTE_ADDR'] = '1.1.1.1';
		$this->assertTrue($server->isLocalHost());
	}
}
