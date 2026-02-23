import { __ } from '@wordpress/i18n';

const learnSections = [
	// SECTION 1: Set Up Store Basics (Required)
	{
		id: 'store-basics',
		title: __( 'Set Up Store Basics', 'surecart' ),
		description: __(
			'These are the required steps to activate your store and start selling with SureCart.',
			'surecart'
		),
		badge: 'required',
		docUrl: 'https://surecart.com/docs/getting-started',
		steps: [
			{
				id: 'complete-setup',
				title: __( 'Complete Setup', 'surecart' ),
				description: __(
					'Create your SureCart account and connect your store to start managing products and payments.',
					'surecart'
				),
				actionLabel: __( 'Set Up', 'surecart' ),
				actionUrl: 'https://app.surecart.com/sign_up',
				isExternal: true,
				autoDetect: 'hasApiToken',
			},
			{
				id: 'add-store-details',
				title: __( 'Add Store Details', 'surecart' ),
				description: __(
					"Set up your store's business information, currency, and basic preferences.",
					'surecart'
				),
				actionLabel: __( 'Set Up', 'surecart' ),
				actionUrl: 'admin.php?page=sc-settings',
				infoTooltip: __(
					'Configure your store name, business address, currency, and other foundational settings.',
					'surecart'
				),
			},
			{
				id: 'add-brand-details',
				title: __( 'Add Brand Details', 'surecart' ),
				description: __(
					"Customize your store's branding so customers recognize you at checkout and in emails.",
					'surecart'
				),
				actionLabel: __( 'Set Up', 'surecart' ),
				actionUrl: 'admin.php?page=sc-settings&tab=brand',
				autoDetect: 'hasBrandColor',
				infoTooltip: __(
					'Upload your logo, set brand colors, and customize email templates.',
					'surecart'
				),
			},
		],
	},

	// SECTION 2: Set Up Shipping (Optional)
	{
		id: 'setup-shipping',
		title: __( 'Set Up Shipping', 'surecart' ),
		description: __(
			"Configure shipping zones and rates. Only needed if you're selling physical products.",
			'surecart'
		),
		badge: 'optional',
		docUrl: 'https://surecart.com/docs/shipping',
		steps: [
			{
				id: 'configure-shipping',
				title: __( 'Configure Shipping Zones & Rates', 'surecart' ),
				description: __(
					'Set up shipping zones, rates, and methods for physical products.',
					'surecart'
				),
				actionLabel: __( 'Set Up', 'surecart' ),
				actionUrl: 'admin.php?page=sc-settings&tab=shipping_protocol',
				infoTooltip: __(
					'Define where you ship, how much it costs, and which shipping methods you offer.',
					'surecart'
				),
			},
		],
	},

	// SECTION 3: Add Your First Product (Required)
	{
		id: 'first-product',
		title: __( 'Add Your First Product', 'surecart' ),
		description: __(
			'Create the product you want to sell and prepare it for checkout.',
			'surecart'
		),
		badge: 'required',
		docUrl: 'https://surecart.com/docs/products',
		steps: [
			{
				id: 'add-product-details',
				title: __( 'Add Product Details', 'surecart' ),
				description: __(
					"Define what you're selling — name, description, pricing, and media.",
					'surecart'
				),
				actionLabel: __( 'Add Product', 'surecart' ),
				actionUrl: 'admin.php?page=sc-products&action=edit',
				autoDetect: 'hasProducts',
				infoTooltip: __(
					'Create your product with images, description, and pricing options.',
					'surecart'
				),
			},
			{
				id: 'add-product-variants',
				title: __( 'Add Product Variants', 'surecart' ),
				description: __(
					'Offer variations like formats, licenses, or plans if your product needs them.',
					'surecart'
				),
				actionLabel: __( 'Add Variants', 'surecart' ),
				actionUrl: 'admin.php?page=sc-products',
				infoTooltip: __(
					'Create size, color, format, or license options for your product.',
					'surecart'
				),
			},
			{
				id: 'publish-product',
				title: __( 'Publish Your Product', 'surecart' ),
				description: __(
					'Make your product live and ready to be purchased.',
					'surecart'
				),
				actionLabel: __( 'Publish', 'surecart' ),
				actionUrl: 'admin.php?page=sc-products',
				infoTooltip: __(
					'Activate your product so it appears in your store and can be purchased.',
					'surecart'
				),
			},
		],
	},

	// SECTION 4: Connect Payment Processor (Required)
	{
		id: 'payment-processor',
		title: __( 'Connect Payment Processor', 'surecart' ),
		description: __(
			'Connect a payment gateway so you can accept real payments from customers.',
			'surecart'
		),
		badge: 'required',
		docUrl: 'https://surecart.com/docs/payment-processors',
		steps: [
			{
				id: 'connect-payment',
				title: __( 'Connect Payment Gateway', 'surecart' ),
				description: __(
					'Link Stripe, PayPal, or another supported gateway to start accepting payments.',
					'surecart'
				),
				actionLabel: __( 'Connect', 'surecart' ),
				actionUrl: 'admin.php?page=sc-settings&tab=processors',
				autoDetect: 'hasProcessor',
				infoTooltip: __(
					'Connect your Stripe, PayPal, or other payment processor account.',
					'surecart'
				),
			},
		],
	},

	// SECTION 5: Test Your Checkout & Go Live (Required)
	{
		id: 'test-checkout',
		title: __( 'Test Your Checkout & Go Live', 'surecart' ),
		description: __(
			'Make a test payment to ensure everything works before accepting real orders.',
			'surecart'
		),
		badge: 'required',
		docUrl: 'https://surecart.com/docs/test-mode',
		steps: [
			{
				id: 'test-payment',
				title: __( 'Make a Test Payment', 'surecart' ),
				description: __(
					'Run a quick test payment to confirm your checkout, payment gateway, and product setup are working correctly.',
					'surecart'
				),
				actionLabel: __( 'Learn How', 'surecart' ),
				actionUrl: 'https://surecart.com/docs/test-mode',
				isExternal: true,
				infoTooltip: __(
					'Use test mode to simulate a purchase and verify your entire checkout flow.',
					'surecart'
				),
			},
		],
	},

	// SECTION 6: Customize Checkout Experience
	{
		id: 'customize-checkout',
		title: __( 'Customize Checkout Experience', 'surecart' ),
		description: __(
			'Personalize your checkout and shop pages to match your brand.',
			'surecart'
		),
		docUrl: 'https://surecart.com/docs/checkout-customization',
		steps: [
			{
				id: 'customize-checkout-form',
				title: __( 'Customize Checkout Form', 'surecart' ),
				description: __(
					'Design your checkout form fields, layout, and styling.',
					'surecart'
				),
				actionLabel: __( 'Customize', 'surecart' ),
				actionUrl: 'edit.php?post_type=sc_form',
				infoTooltip: __(
					'Use the WordPress block editor to customize your checkout page design.',
					'surecart'
				),
			},
			{
				id: 'setup-shop-page',
				title: __( 'Set Up Shop Page', 'surecart' ),
				description: __(
					'Create a page to showcase all your products.',
					'surecart'
				),
				actionLabel: __( 'Edit Shop', 'surecart' ),
				actionUrl: 'admin.php?page=sc-products',
				infoTooltip: __(
					'Design your product catalog page using WordPress blocks.',
					'surecart'
				),
			},
		],
	},

	// SECTION 7: Manage Orders & Customers
	{
		id: 'manage-business',
		title: __( 'Manage Orders & Customers', 'surecart' ),
		description: __(
			'Handle incoming orders and set up self-service customer tools.',
			'surecart'
		),
		docUrl: 'https://surecart.com/docs/orders',
		steps: [
			{
				id: 'view-orders',
				title: __( 'View & Manage Orders', 'surecart' ),
				description: __(
					'Monitor and process customer orders as they come in.',
					'surecart'
				),
				actionLabel: __( 'View Orders', 'surecart' ),
				actionUrl: 'admin.php?page=sc-orders',
				infoTooltip: __(
					'Access your order dashboard to fulfill, refund, and track orders.',
					'surecart'
				),
			},
			{
				id: 'customer-portal',
				title: __( 'Set Up Customer Portal', 'surecart' ),
				description: __(
					'Let customers manage their own subscriptions, invoices, and account details.',
					'surecart'
				),
				actionLabel: __( 'Configure', 'surecart' ),
				actionUrl:
					'admin.php?page=sc-settings&tab=customer_notification_protocol',
				infoTooltip: __(
					'Enable a self-service portal where customers can manage their purchases.',
					'surecart'
				),
			},
		],
	},

	// SECTION 8: Grow Your Revenue
	{
		id: 'grow-revenue',
		title: __( 'Grow Your Revenue', 'surecart' ),
		description: __(
			'Unlock more revenue from every visitor using built-in conversion and pricing tools.',
			'surecart'
		),
		docUrl: 'https://surecart.com/docs/marketing',
		steps: [
			{
				id: 'create-coupon',
				title: __( 'Create Coupons & Discounts', 'surecart' ),
				description: __(
					'Offer promo codes or limited-time discounts to boost conversions and run campaigns.',
					'surecart'
				),
				actionLabel: __( 'Add Coupon', 'surecart' ),
				actionUrl: 'admin.php?page=sc-coupons',
				infoTooltip: __(
					'Create percentage or fixed-amount discount codes for promotions.',
					'surecart'
				),
			},
			{
				id: 'dynamic-pricing',
				title: __( 'Apply Dynamic Pricing', 'surecart' ),
				description: __(
					'Automatically apply fees and discounts based on rules like user roles, purchase history, or location.',
					'surecart'
				),
				actionLabel: __( 'Set Up', 'surecart' ),
				actionUrl: 'admin.php?page=sc-auto-fees',
				infoTooltip: __(
					'Create rule-based pricing that adjusts automatically per customer.',
					'surecart'
				),
			},
			{
				id: 'order-bumps',
				title: __( 'Add Order Bumps', 'surecart' ),
				description: __(
					'Add a small, high-value add-on directly on the checkout page.',
					'surecart'
				),
				actionLabel: __( 'Add Bump', 'surecart' ),
				actionUrl: 'admin.php?page=sc-bumps',
				infoTooltip: __(
					'Offer a complementary product as a checkbox on the checkout page.',
					'surecart'
				),
			},
			{
				id: 'upsells',
				title: __( 'Create Upsell Offers', 'surecart' ),
				description: __(
					'Present a follow-up offer after checkout to increase revenue without disrupting the purchase.',
					'surecart'
				),
				actionLabel: __( 'Add Upsell', 'surecart' ),
				actionUrl: 'admin.php?page=sc-upsell-funnels',
				infoTooltip: __(
					'Show post-purchase offers to increase average order value.',
					'surecart'
				),
			},
			{
				id: 'cart-recovery',
				title: __( 'Enable Cart Recovery', 'surecart' ),
				description: __(
					"Recover lost revenue by following up with customers who don't complete checkout.",
					'surecart'
				),
				actionLabel: __( 'Enable', 'surecart' ),
				actionUrl:
					'admin.php?page=sc-settings&tab=abandoned_checkout',
				infoTooltip: __(
					'Send automated emails to customers who abandon their cart.',
					'surecart'
				),
			},
			{
				id: 'subscriptions',
				title: __( 'Set Up Subscriptions', 'surecart' ),
				description: __(
					'Configure recurring billing and subscription management for predictable revenue.',
					'surecart'
				),
				actionLabel: __( 'Configure', 'surecart' ),
				actionUrl:
					'admin.php?page=sc-settings&tab=subscription_protocol',
				infoTooltip: __(
					'Enable subscription billing, trial periods, and renewal settings.',
					'surecart'
				),
			},
			{
				id: 'affiliates',
				title: __( 'Set Up Affiliates', 'surecart' ),
				description: __(
					'Let others promote your products and earn commissions on sales they refer.',
					'surecart'
				),
				actionLabel: __( 'Set Up', 'surecart' ),
				actionUrl:
					'admin.php?page=sc-settings&tab=affiliation_protocol',
				infoTooltip: __(
					'Create an affiliate program with custom commission structures.',
					'surecart'
				),
			},
		],
	},
];

export default learnSections;
