<?php

namespace SureCart\Tests\Services;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Models\Account;
use SureCart\Models\Brand;
use SureCart\Models\TaxProtocol;
use SureCart\Account\AccountServiceProvider;
use SureCart\Request\RequestServiceProvider;
use SureCart\Models\AffiliationProtocol;
use SureCart\Models\ShippingProtocol;
use SureCart\Models\CustomerPortalProtocol;

class AccountServiceTest extends SureCartUnitTestCase {
	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		parent::setUp();

		//Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				AccountServiceProvider::class,
				RequestServiceProvider::class
			],
		], false);

		$taxProtocol = new TaxProtocol([
			'id' => '19e268d3-4bcb-4f4b-bb07-8fcb6d23cbc1',
			'object' => 'tax_protocol',
			'ca_tax_enabled' => false,
			'eu_micro_exemption_enabled' => false,
			'eu_tax_enabled' => true,
			'eu_vat_required' => false,
			'eu_vat_unverified_behavior' => 'skip_reverse_charge',
			'eu_vat_local_reverse_charge' => true,
			'tax_behavior' => 'inclusive',
			'tax_enabled' => true,
			'default_tax_enabled' => true,
			'default_rate' => '20.0',
			'address' => (object)[
				'id' => 'a5f3875e-3a8d-49cd-92f7-b9fcdf976697',
				'object' => 'address',
				'city' => 'Pune',
				'country' => 'IN',
				'line_1' => 'Vasant Utsav',
				'line_2' => 'Opp Shell PP',
				'name' => 'Rajkiran Bagal',
				'postal_code' => '411039',
				'state' => 'MH',
				'created_at' => 1686819412,
				'updated_at' => 1694088483
			],
			'ca_tax_identifier' => null,
			'eu_tax_identifier' => '6d74b1c9-646f-482e-aa41-c453fd663fbd',
			'created_at' => 1658818243,
			'updated_at' => 1713337838
		]);

		$brand = new Brand([
			'id' => '7bec29ca-f15f-4b6c-ad17-de8b6806300d',
			'object' => 'brand',
			'color' => '17E19C',
			'email' => 'rajkiranb@bsf.io',
			'phone' => '9890884927',
			'powered_by_enabled' => true,
			'website' => 'http://bsfdev.test/',
			'address' => (object)[
				'id' => '53389d22-bb96-406f-b175-d501596b67d6',
				'object' => 'address',
				'city' => 'Pune',
				'country' => 'IN',
				'line_1' => 'Vinayak Residency',
				'line_2' => 'Dighi Road',
				'name' => "Raj's Store",
				'postal_code' => '411039',
				'state' => 'MH',
				'created_at' => 1686214220,
				'updated_at' => 1691471200
			],
			'logo' => 'ae254380-7564-4919-bbbe-7eebb6281210',
			'logo_url' => 'https://media.surecart.com/6fkv34eefitnpokweinx1ikuz620',
			'created_at' => 1658818243,
			'updated_at' => 1724652194
		]);

		$affiliationProtocol = new AffiliationProtocol([
			'wordpress_plugin_tracking_enabled' => true
		]);

		$shippingProtocol = new ShippingProtocol([
			'shipping_enabled' => true,
		]);

		$portalProtocol = new CustomerPortalProtocol([
			'privacy_url' => 'http://bsfdev.test/privacy',
			'terms_url' => 'http://bsfdev.test/terms'
		]);

		$account = new Account([
			'id' => '81784ba6-072b-48b4-a460-ec9405b2b540',
			'object' => 'account',
			'claimed' => true,
			'claim_url' => null,
			'currency' => 'usd',
			'currency_locked' => true,
			'entitlements' => (object)[
				'abandoned_checkouts' => true,
				'affiliates' => true,
				'subscription_preservation' => true
			],
			'locale' => 'en',
			'medias_total_byte_size' => 16371923,
			'name' => "Raj's Store",
			'slug' => 'rajstore',
			'time_zone' => 'Asia/Kolkata',
			'url' => 'http://bsfdev.test',
			'plan' => (object)[
				'name' => 'free'
			],
			'public_token' => 'pt_bz4UNuZzVfxXD8fPsR5sc8Lq',
			'seeded_at' => null,
			'abandoned_checkout_protocol' => '0df63946-f392-4796-aec9-e3a5b316808a',
			'affiliation_protocol' => $affiliationProtocol,
			'brand' => $brand,
			'customer_notification_protocol' => 'dc4a5c1a-693a-4290-b3d9-85db7f3d7fdc',
			'owner' => '8161b42b-aa35-4a83-a1ae-9467b4a96561',
			'order_protocol' => '91bca178-6bbc-4e40-8ccf-d7060653c0a2',
			'customer_portal_protocol' => $portalProtocol,
			'subscription_protocol' => (object)[],
			'shipping_protocol' => $shippingProtocol,
			'tax_protocol' => $taxProtocol,
			'test_data_purged_at' => 1690534189,
			'processors' => [(object)[]],
			'customer_locale' => 'en',
			'coupons_updated_at' => 'coupons/query-13e7b211e444d56ad4c243a9a9a4048a-16-20240705142602032292',
			'manual_payment_methods_updated_at' => 'manual_payment_methods/query-a6817673fa9ded9fdbd0ac8e10bf8fdd-9-20240617132650450909',
			'processors_updated_at' => 'processors/query-6e8c65d92b1112af0d10bb09e6cedf9e-9-20240906115757501424',
			'products_updated_at' => 'products/query-6a1a52c730993780b988b8689328fe00-49-20240910095410214857',
			'product_collections_updated_at' => 'product_collections/query-d74ebe8cab72de4b7cd42bc0bdfe769e-12-20240326102108153405',
			'webhook_endpoints_updated_at' => 'webhook_endpoints/query-c9c6b542fbef0cb70e4d8b02ec8d3d24-18-20240909054242089121',
			'created_at' => 1658818244,
			'updated_at' => 1724742557
		]);

		$this->account = $account;
	}

	public function test_account_service_when_transient_is_set() {
		$accountService = \SureCart::account();

		set_transient('surecart_account', $this->account);

		$this->assertSame('81784ba6-072b-48b4-a460-ec9405b2b540', $accountService->fetchCachedAccount()->id);

		delete_transient('surecart_account');

	}

	public function test_convert_account_to_array() {
		update_option( 'sc_previous_account', $this->account->toArray() );

		$savedAccount = get_option('sc_previous_account');

		$this->assertSame($this->account->id, $savedAccount['id']);
		$this->assertSame($this->account->name, $savedAccount['name']);
		$this->assertSame($this->account->currency, $savedAccount['currency']);
		$this->assertSame($this->account->claimed, $savedAccount['claimed']);
	}

	/**
	 * @group account
	 */
	public function test_convert_array_to_account() {
		$accountService = \SureCart::account();

		$account = $accountService->convertArrayToAccount($this->account->toArray());

		$this->assertSame($this->account->id, $account->id);
		$this->assertSame($this->account->name, $account->name);
		$this->assertSame($this->account->currency, $account->currency);
		$this->assertSame($this->account->claimed, $account->claimed);
		$this->assertSame($this->account->affiliation_protocol->wordpress_plugin_tracking_enabled, $account->affiliation_protocol->wordpress_plugin_tracking_enabled);
		$this->assertSame($this->account->entitlements->affiliates, $account->entitlements->affiliates);
		$this->assertSame($this->account->entitlements->abandoned_checkouts, $account->entitlements->abandoned_checkouts);
		$this->assertSame($this->account->entitlements->subscription_preservation, $account->entitlements->subscription_preservation);
		$this->assertSame($this->account->plan->name, $account->plan->name);
		$this->assertSame($this->account->shipping_protocol->shipping_enabled, $account->shipping_protocol->shipping_enabled);
		$this->assertSame($this->account->customer_portal_protocol->privacy_url, $account->customer_portal_protocol->privacy_url);
		$this->assertSame($this->account->customer_portal_protocol->terms_url, $account->customer_portal_protocol->terms_url);
		$this->assertSame($this->account->brand->color, $account->brand->color);
		$this->assertSame($this->account->brand->address->city, $account->brand->address->city);
		$this->assertSame($this->account->tax_protocol->eu_tax_enabled, $account->tax_protocol->eu_tax_enabled);
		$this->assertSame($this->account->tax_protocol->address->city, $account->tax_protocol->address->city);
		$this->assertSame($this->account->tax_protocol->id, $account->tax_protocol->id);
	}

	/**
	 * @group account
	 */
	public function test_claim_expired_with_past_timestamp() {
		$account = new Account(['claim_window_ends_at' => time() - 3600]);
		$this->assertTrue($account->claim_expired);
	}
	
	/**
	 * @group account
	 */
	public function test_claim_expired_with_future_timestamp() {
		$account = new Account(['claim_window_ends_at' => time() + 3600]);
		$this->assertFalse($account->claim_expired);
	}
	
	/**
	 * @group account
	 */
	public function test_claim_expired_with_null_timestamp() {
		$account = new Account(['claim_window_ends_at' => null]);
		$this->assertFalse($account->claim_expired);
	}
	
	/**
	 * @group account
	 */
	public function test_claim_expired_with_invalid_timestamp() {
		$account = new Account(['claim_window_ends_at' => 'invalid']);
		$this->assertFalse($account->claim_expired);
	}
}
