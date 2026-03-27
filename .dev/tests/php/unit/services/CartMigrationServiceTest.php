<?php

namespace SureCart\Tests\Services;

use SureCart\BlockLibrary\CartMigrationService;
use SureCart\Tests\SureCartUnitTestCase;

class CartMigrationServiceTest extends SureCartUnitTestCase {
	/**
	 * @var CartMigrationService
	 */
	public $service = null;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		// Set up an app instance with whatever stubs and mocks we need before every test.
		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\BlockLibrary\BlockServiceProvider::class,
			],
		], false);

		$attributes = [
			'title' => 'Cart',
			'width' => '500px',
		];

		$block = (object) [
            'parsed_block' => [
				'innerBlocks' => [
					['blockName' => 'surecart/cart-header', 'attrs' => ['key1' => 'value1']],
					['blockName' => 'surecart/cart-items', 'attrs' => ['key2' => 'value2']],
					['blockName' => 'surecart/cart-coupon', 'attrs' => ['key3' => 'value3']],
					['blockName' => 'surecart/cart-bump-line-item', 'attrs' => ['key4' => 'value4']],
					['blockName' => 'surecart/cart-subtotal', 'attrs' => ['key5' => 'value5']],
					['blockName' => 'surecart/cart-message', 'attrs' => ['key6' => 'value6','text' => 'value6']],
					['blockName' => 'surecart/cart-submit', 'attrs' => ['key7' => 'value7']],
				],
            ],
        ];

		$this->service = new CartMigrationService(
			$attributes,
			$block
		);

		parent::setUp();
	}

	/**
	 * @group block
	 */
	public function test_constructor_sets_attributes()
    {
        $attributes = [
			'title' => 'Cart',
			'width' => '500px',
		];

        $this->assertSame($attributes, $this->service->attributes);
    }

	/**
	 * @group block
	 */
	public function test_get_child_blocks_attributes()
    {
        $block = (object) [
            'parsed_block' => [
                'innerBlocks' => [
                    ['blockName' => 'surecart/cart-header', 'attrs' => ['key1' => 'value1']],
					['blockName' => 'surecart/cart-items', 'attrs' => ['key2' => 'value2']],
					['blockName' => 'surecart/cart-coupon', 'attrs' => ['key3' => 'value3']],
					['blockName' => 'surecart/cart-bump-line-item', 'attrs' => ['key4' => 'value4']],
					['blockName' => 'surecart/cart-subtotal', 'attrs' => ['key5' => 'value5']],
					['blockName' => 'surecart/cart-message', 'attrs' => ['key6' => 'value6','text' => 'value6']],
					['blockName' => 'surecart/cart-submit', 'attrs' => ['key7' => 'value7']],
                ],
            ],
        ];

		$service = new CartMigrationService([], $block);

        $result = $service->getChildBlocksAttributes('surecart/cart-header');
        $this->assertSame(['key1' => 'value1'], $result);
    }

	/**
	 * @group block
	 */
	public function test_get_child_blocks_attributes_returns_empty_array_if_no_inner_blocks()
	{
		$block = (object) ['parsed_block' => ['innerBlocks' => []]];

		$service = new CartMigrationService([], $block);

		$result = $service->getChildBlocksAttributes('test/block');
		$this->assertSame([], $result);
	}

	/**
	 * @group block
	 */
	public function test_render_header()
	{
		$this->service->renderCartHeader();
		$this->assertStringContainsString('<!-- wp:surecart/slide-out-cart-header {"key1":"value1"} /-->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_items()
	{
		$this->service->renderCartItems();
		$this->assertStringContainsString('<!-- wp:surecart/slide-out-cart-items {"key2":"value2"} /-->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_coupon()
	{
		$this->service->renderCartCoupon();
		$this->assertStringContainsString('<!-- wp:surecart/slide-out-cart-coupon {"key3":"value3"} /-->',$this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_bump_line_item()
	{
		$this->service->renderCartBumpLineItem();
		$this->assertStringContainsString('<!-- wp:surecart/slide-out-cart-bump-line-item {"key4":"value4"} /-->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_subtotal()
	{
		$this->service->renderCartSubtotal();
		$this->assertStringContainsString('<!-- wp:surecart/slide-out-cart-subtotal {"key5":"value5"} /-->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_message()
	{
		$this->service->renderCartMessage();
		$this->assertStringContainsString('<!-- wp:surecart/slide-out-cart-message {"key6":"value6","text":"value6"} /-->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_submit()
	{
		$this->service->renderCartSubmit();
		$this->assertStringContainsString('<!-- wp:surecart/slide-out-cart-submit {"key7":"value7"} /-->', $this->service->block_html);
	}

	/**
	 * @group block
	 */
	public function test_render_cart_template()
	{
		$this->service->renderCartTemplate();
		$this->assertStringContainsString('<!-- wp:surecart/slide-out-cart-header {"key1":"value1"} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/slide-out-cart-items {"key2":"value2"} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/slide-out-cart-coupon {"key3":"value3"} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/slide-out-cart-bump-line-item {"key4":"value4"} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/slide-out-cart-subtotal {"key5":"value5"} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/slide-out-cart-message {"key6":"value6","text":"value6"} /-->', $this->service->block_html);
		$this->assertStringContainsString('<!-- wp:surecart/slide-out-cart-submit {"key7":"value7"} /-->', $this->service->block_html);
	}
}
