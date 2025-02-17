<?php

use SureCart\Support\Encryption;
use SureCart\Tests\SureCartUnitTestCase;

class EncryptionTest extends SureCartUnitTestCase {
	public function test_can_encrypt_and_decrypt()
	{
		$string = 'asdfasjk;dflkj123523609u';
		$encrypted = Encryption::encrypt($string);
		$decripted = Encryption::decrypt($encrypted);

		$this->assertNotSame($string, $encrypted);
		$this->assertSame($string, $decripted);
	}
}
