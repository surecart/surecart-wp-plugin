import { __ } from '@wordpress/i18n';

const learnSections = [
	// SECTION 1: Set Up Store Basics (Required)
	{
		id: 'store-basics',
		title: __('Set Up Store Basics', 'surecart'),
		description: __(
			'Get your store ready and make your first sale.',
			'surecart'
		),
		badge: 'required',
		icon: 'home',
		docUrl: 'https://surecart.com/docs/getting-started',
		steps: [
			{
				id: 'complete-setup',
				title: __('Complete Setup', 'surecart'),
				description: __(
					'Create your SureCart account and connect your store to start managing products and payments.',
					'surecart'
				),
				actionLabel: __('Set Up', 'surecart'),
				actionUrl: 'https://app.surecart.com/sign_up',
				isExternal: true,
				autoDetect: 'hasApiToken',
			},
			{
				id: 'connect-payment',
				title: __('Connect Payment Gateway', 'surecart'),
				description: __(
					'Link Stripe, PayPal, or another supported gateway to start accepting payments.',
					'surecart'
				),
				actionLabel: __('Connect', 'surecart'),
				actionUrl: 'admin.php?page=sc-settings&tab=processors',
				autoDetect: 'hasProcessor',
				infoTooltip: __(
					"You'll need an account with your payment provider before connecting.",
					'surecart'
				),
			},
			{
				id: 'add-store-details',
				title: __('Add Store Details', 'surecart'),
				description: __(
					"Set up your store's business information, currency, and basic preferences.",
					'surecart'
				),
				actionLabel: __('Set Up', 'surecart'),
				actionUrl: 'admin.php?page=sc-settings',
				infoTooltip: __(
					'Configure your store name, business address, currency, and other foundational settings.',
					'surecart'
				),
			},
			{
				id: 'add-brand-details',
				title: __('Add Brand Details', 'surecart'),
				description: __(
					"Customize your store's branding so customers recognize you at checkout and in emails.",
					'surecart'
				),
				actionLabel: __('Set Up', 'surecart'),
				actionUrl: 'admin.php?page=sc-settings&tab=brand',
				autoDetect: 'hasBrandDetails',
				infoTooltip: __(
					'Upload your logo, set brand colors, and customize email templates.',
					'surecart'
				),
			},
			{
				id: 'customer-dashboard-page',
				title: __('Customer Dashboard Page', 'surecart'),
				description: __(
					'Customize the page your customers land on after completing a purchase.',
					'surecart'
				),
				actionLabel: __('Set Up', 'surecart'),
				actionUrl: window.scData?.dashboard_page_edit_url || undefined,
			},
			{
				id: 'configure-tax',
				title: __('Configure Tax Settings', 'surecart'),
				description: __(
					'Set up tax collection rules so the correct tax is applied at checkout.',
					'surecart'
				),
				badge: 'required',
				actionLabel: __('Set Up', 'surecart'),
				actionUrl: 'admin.php?page=sc-settings&tab=tax_protocol',
				infoTooltip: __(
					'Configure tax rates, regions, and automatic tax calculation.',
					'surecart'
				),
			},
			{
				id: 'setup-transactional-emails',
				title: __('Set Up Transactional Emails', 'surecart'),
				description: __(
					'Configure the emails customers receive for orders, receipts, and account updates.',
					'surecart'
				),
				badge: 'recommended',
				actionLabel: __('Set Up', 'surecart'),
				actionUrl:
					'admin.php?page=sc-settings&tab=customer_notification_protocol',
				infoTooltip: __(
					'Customize order confirmation, receipt, and notification emails.',
					'surecart'
				),
			},
			{
				id: 'add-privacy-terms',
				title: __('Add Privacy Policy & Terms of Service', 'surecart'),
				description: __(
					'Add links to your privacy policy and terms of service so customers can review them at checkout.',
					'surecart'
				),
				badge: 'recommended',
				actionLabel: __('Configure', 'surecart'),
				actionUrl: 'admin.php?page=sc-settings',
				infoTooltip: __(
					'Display legal links on your checkout form for transparency and compliance.',
					'surecart'
				),
			},
		],
	},

	// SECTION 2: Add Your First Product (Required)
	{
		id: 'first-product',
		title: __('Add Your First Product', 'surecart'),
		description: __(
			'Create the product you want to sell and prepare it for checkout.',
			'surecart'
		),
		badge: 'required',
		icon: 'tag',
		docUrl: 'https://surecart.com/docs/create-product/',
		steps: [
			{
				id: 'add-product-details',
				title: __('Add Product Details', 'surecart'),
				description: __(
					"Define what you're selling — name, description, pricing, and media.",
					'surecart'
				),
				actionLabel: __('Add Product', 'surecart'),
				actionUrl: 'admin.php?page=sc-products&action=edit',
				autoDetect: 'hasProducts',
				infoTooltip: __(
					'Create your product with images, description, and pricing options.',
					'surecart'
				),
			},
			{
				id: 'add-product-variants',
				title: __('Add Product Variants', 'surecart'),
				description: __(
					'Offer variations like formats, licenses, or plans if your product needs them.',
					'surecart'
				),
				actionLabel: __('Add Variants', 'surecart'),
				actionUrl: 'admin.php?page=sc-products',
				infoTooltip: __(
					'Create size, color, format, or license options for your product.',
					'surecart'
				),
			},
			{
				id: 'publish-product',
				title: __('Publish Your Product', 'surecart'),
				description: __(
					'Make your product live and ready to be purchased.',
					'surecart'
				),
				actionLabel: __('Publish', 'surecart'),
				actionUrl: 'admin.php?page=sc-products',
				infoTooltip: __(
					'Activate your product so it appears in your store and can be purchased.',
					'surecart'
				),
			},
		],
	},

	// SECTION 3: Customize Checkout Experience (Recommended)
	{
		id: 'customize-checkout',
		title: __('Customize Checkout Experience', 'surecart'),
		description: __(
			'Personalize your checkout and shop pages to match your brand.',
			'surecart'
		),
		badge: 'recommended',
		icon: 'pen-tool',
		docUrl: 'https://surecart.com/docs/edit-checkout-form/',
		steps: [
			{
				id: 'customize-checkout-form',
				title: __('Customize Checkout Form', 'surecart'),
				description: __(
					'Design your checkout form fields, layout, and styling.',
					'surecart'
				),
				actionLabel: __('Customize', 'surecart'),
				actionUrl: 'edit.php?post_type=sc_form',
				infoTooltip: __(
					'Use the WordPress block editor to customize your checkout page design.',
					'surecart'
				),
			},
			{
				id: 'setup-shop-page',
				title: __('Set Up Shop Page', 'surecart'),
				description: __(
					'Create a page to showcase all your products.',
					'surecart'
				),
				actionLabel: __('Edit Shop', 'surecart'),
				actionUrl: window.scData?.shop_page_edit_url || undefined,
				infoTooltip: __(
					'Design your product catalog page using WordPress blocks.',
					'surecart'
				),
			},
		],
	},

	// SECTION 4: Set Up Shipping (Optional)
	{
		id: 'setup-shipping',
		title: __('Set Up Shipping', 'surecart'),
		description: __(
			"Configure shipping zones and rates. Only needed if you're selling physical products.",
			'surecart'
		),
		badge: 'optional',
		icon: 'truck',
		docUrl: 'https://surecart.com/docs/shipping',
		steps: [
			{
				id: 'configure-shipping',
				title: __('Configure Shipping Zones & Rates', 'surecart'),
				description: __(
					'Set up shipping zones, rates, and methods for physical products.',
					'surecart'
				),
				actionLabel: __('Set Up', 'surecart'),
				actionUrl: 'admin.php?page=sc-settings&tab=shipping_protocol',
				infoTooltip: __(
					'Rates can be flat, weight-based, or free over a threshold.',
					'surecart'
				),
			},
		],
	},

	// SECTION 5: Test Your Checkout & Go Live (Required)
	{
		id: 'test-checkout',
		title: __('Test Your Checkout & Go Live', 'surecart'),
		description: __(
			'Make a test payment to ensure everything works before accepting real orders.',
			'surecart'
		),
		badge: 'required',
		icon: 'zap',
		docUrl: 'https://surecart.com/docs/how-to-make-test-payments/',
		steps: [
			{
				id: 'test-payment',
				title: __('Make a Test Payment', 'surecart'),
				description: __(
					'Run a quick test payment to confirm your checkout, payment gateway, and product setup are working correctly.',
					'surecart'
				),
				infoTooltip: __(
					'Use test mode to simulate a purchase and verify your entire checkout flow.',
					'surecart'
				),
			},
		],
	},

	// SECTION 6: Manage Orders & Customers (Recommended)
	{
		id: 'manage-business',
		title: __('Manage Orders & Customers', 'surecart'),
		description: __(
			'Handle incoming orders and set up self-service customer tools.',
			'surecart'
		),
		badge: 'recommended',
		icon: 'users',
		docUrl: 'https://surecart.com/docs/orders',
		steps: [
			{
				id: 'view-orders',
				title: __('View & Manage Orders', 'surecart'),
				description: __(
					'Monitor and process customer orders as they come in.',
					'surecart'
				),
				actionLabel: __('View Orders', 'surecart'),
				actionUrl: 'admin.php?page=sc-orders',
				infoTooltip: __(
					'Access your order dashboard to fulfill, refund, and track orders.',
					'surecart'
				),
			},
			{
				id: 'customer-portal',
				title: __('Set Up Customer Portal', 'surecart'),
				description: __(
					'Control what customers can do from their portal — manage subscriptions, change plans, and update payment methods.',
					'surecart'
				),
				actionLabel: __('Configure Portal', 'surecart'),
				actionUrl:
					'admin.php?page=sc-settings&tab=subscription_protocol',
				infoTooltip: __(
					'Enable a self-service portal where customers can manage their purchases.',
					'surecart'
				),
			},
		],
	},

	// SECTION 7: Grow Your Revenue
	{
		id: 'grow-revenue',
		title: __('Grow Your Revenue', 'surecart'),
		description: __(
			'Unlock more revenue from every visitor using built-in conversion and pricing tools.',
			'surecart'
		),
		icon: 'trending-up',
		highlighted: true,
		docUrl: 'https://surecart.com/docs-category/revenue-booster/',
		steps: [
			{
				id: 'create-coupon',
				title: __('Create Coupons & Discounts', 'surecart'),
				description: __(
					'Offer promo codes or limited-time discounts to boost conversions and run campaigns.',
					'surecart'
				),
				actionLabel: __('Add Coupon', 'surecart'),
				actionUrl: 'admin.php?page=sc-coupons',
				infoTooltip: __(
					'Create percentage or fixed-amount discount codes for promotions.',
					'surecart'
				),
			},
			{
				id: 'dynamic-pricing',
				title: __('Apply Dynamic Pricing', 'surecart'),
				description: __(
					'Automatically apply fees and discounts based on rules like user roles, purchase history, or location.',
					'surecart'
				),
				actionLabel: __('Set Up', 'surecart'),
				actionUrl: 'admin.php?page=sc-auto-fees',
				infoTooltip: __(
					'Create rule-based pricing that adjusts automatically per customer.',
					'surecart'
				),
			},
			{
				id: 'order-bumps',
				title: __('Add Order Bumps', 'surecart'),
				description: __(
					'Add a small, high-value add-on directly on the checkout page. Requires a published product and active checkout before setup.',
					'surecart'
				),
				actionLabel: __('Add Bump', 'surecart'),
				actionUrl: 'admin.php?page=sc-bumps',
				infoTooltip: __(
					'Offer a complementary product as a checkbox on the checkout page.',
					'surecart'
				),
			},
			{
				id: 'upsells',
				title: __('Create Upsell Offers', 'surecart'),
				description: __(
					'Present a follow-up offer after checkout to increase revenue without disrupting the purchase. Requires a published product and active checkout before setup.',
					'surecart'
				),
				actionLabel: __('Add Upsell', 'surecart'),
				actionUrl: 'admin.php?page=sc-upsell-funnels',
				infoTooltip: __(
					'Show post-purchase offers to increase average order value.',
					'surecart'
				),
			},
			{
				id: 'cart-recovery',
				title: __('Enable Cart Recovery', 'surecart'),
				description: __(
					"Recover lost revenue by following up with customers who don't complete checkout.",
					'surecart'
				),
				actionLabel: __('Enable', 'surecart'),
				actionUrl: 'admin.php?page=sc-settings&tab=abandoned_checkout',
				infoTooltip: __(
					'Send automated emails to customers who abandon their cart.',
					'surecart'
				),
			},
			{
				id: 'subscriptions',
				title: __('Set Up Subscriptions', 'surecart'),
				description: __(
					'Configure recurring billing and subscription management for predictable revenue.',
					'surecart'
				),
				actionLabel: __('Configure', 'surecart'),
				actionUrl:
					'admin.php?page=sc-settings&tab=subscription_protocol',
				infoTooltip: __(
					'Enable subscription billing, trial periods, and renewal settings.',
					'surecart'
				),
			},
			{
				id: 'affiliates',
				title: __('Set Up Affiliates', 'surecart'),
				description: __(
					'Let others promote your products and earn commissions on sales they refer.',
					'surecart'
				),
				actionLabel: __('Set Up', 'surecart'),
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
