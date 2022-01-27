<?php

use CheckoutEngine\Support\Encryption;
use CheckoutEngine\Tests\CheckoutEngineUnitTestCase;

class EncryptionTest extends CheckoutEngineUnitTestCase {
	public function test_can_encrypt_and_decrypt()
	{
		$string = 'asdfasjk;dflkj123523609u';
		$encrypted = Encryption::encrypt($string);
		$decripted = Encryption::decrypt($encrypted);

		$this->assertNotSame($string, $encrypted);
		$this->assertSame($string, $decripted);

		// Test with a custom key
		define('CHECKOUT_ENGINE_ENCRYPTION_KEY', 'logged_in_key');
		$string = 'asdfasjk;dflkj123523609u';
		$encrypted_ce_key = Encryption::encrypt($string);
		$decripted_ce_key = Encryption::decrypt($encrypted_ce_key);

		$this->assertNotSame($encrypted, $encrypted_ce_key);
		$this->assertNotSame($string, $encrypted_ce_key);
		$this->assertSame($string, $decripted_ce_key);
	}
}
