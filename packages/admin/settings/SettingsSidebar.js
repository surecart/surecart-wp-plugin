/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useLink } from '../router';

/**
 * Single sidebar tab item.
 */
function SidebarTab({ tab, icon, label, currentTab, badge, iconStyle }) {
	const params = tab ? { page: 'sc-settings', tab } : { page: 'sc-settings' };
	const { href, onClick } = useLink(params);

	const isActive = tab ? currentTab === tab : !currentTab;

	return (
		<sc-tab href={href} active={isActive || undefined} onClick={onClick}>
			<sc-icon
				slot="prefix"
				style={iconStyle || { width: '18px', height: '18px' }}
				name={icon}
			></sc-icon>
			{label}
			{badge && <span className="sc-new-badge"></span>}
		</sc-tab>
	);
}

/**
 * Icon style presets for non-standard icons.
 */
const ICON_STYLE_WIDE = {
	fontSize: '18px',
	width: '18px',
	strokeWidth: '4',
};

/**
 * Tab definitions for the settings sidebar.
 * Tabs are rendered in order. `requiresToken` tabs are hidden when no API token is set.
 */
const TABS = [
	// Tabs that require an API token.
	{
		tab: '',
		icon: 'sliders',
		label: __('Store Settings', 'surecart'),
		requiresToken: true,
	},
	{
		tab: 'brand',
		icon: 'pen-tool',
		label: __('Design & Branding', 'surecart'),
		requiresToken: true,
	},
	{
		tab: 'order',
		icon: 'shopping-bag',
		label: __('Orders & Invoices', 'surecart'),
		requiresToken: true,
	},
	{
		tab: 'abandoned_checkout',
		icon: 'shopping-cart',
		label: __('Abandoned Checkout', 'surecart'),
		requiresToken: true,
	},
	{
		tab: 'customer_notification_protocol',
		icon: 'bell',
		label: __('Notifications', 'surecart'),
		requiresToken: true,
	},
	{
		tab: 'subscription_protocol',
		icon: 'refresh-ccw',
		label: __('Subscriptions', 'surecart'),
		requiresToken: true,
	},
	{
		tab: 'subscription_preservation',
		icon: 'bar-chart-2',
		label: __('Subscription Saver', 'surecart'),
		requiresToken: true,
	},
	{
		tab: 'dynamic_pricing',
		icon: 'badge-percent',
		label: __('Dynamic Pricing', 'surecart'),
		requiresToken: true,
	},
	{
		tab: 'affiliation_protocol',
		icon: 'mouse-pointer',
		label: __('Affiliates', 'surecart'),
		requiresToken: true,
		iconStyle: ICON_STYLE_WIDE,
	},
	{
		tab: 'review_protocol',
		icon: 'star',
		label: __('Reviews', 'surecart'),
		requiresToken: true,
		badge: true,
	},
	{
		tab: 'tax_protocol',
		icon: 'tag',
		label: __('Taxes', 'surecart'),
		requiresToken: true,
	},
	{
		tab: 'shipping_protocol',
		icon: 'truck',
		label: __('Shipping', 'surecart'),
		requiresToken: true,
	},
	{
		tab: 'processors',
		icon: 'credit-card',
		label: __('Payment Processors', 'surecart'),
		requiresToken: true,
	},
	{
		tab: 'display_currency',
		icon: 'dollar-sign',
		label: __('Currencies', 'surecart'),
		requiresToken: true,
	},
	{
		tab: 'export',
		icon: 'layers',
		label: __('Data Export', 'surecart'),
		requiresToken: true,
		iconStyle: ICON_STYLE_WIDE,
	},
	{
		tab: 'integrations',
		icon: 'zap',
		label: __('Integrations', 'surecart'),
		requiresToken: true,
		iconStyle: { width: '18px', height: '18px', opacity: '0.7' },
	},
	{
		tab: 'mcp',
		icon: 'cpu',
		label: __('MCP', 'surecart'),
		requiresToken: true,
	},

	// Tabs always visible (even without API token).
	{
		tab: 'connection',
		icon: 'upload-cloud',
		label: __('Connection', 'surecart'),
		iconStyle: ICON_STYLE_WIDE,
	},
	{
		tab: 'advanced',
		icon: 'sliders',
		label: __('Advanced', 'surecart'),
		iconStyle: ICON_STYLE_WIDE,
	},
];

/**
 * Sidebar navigation for settings.
 */
export default function SettingsSidebar({ currentTab }) {
	const hasApiToken = !!window.scSettingsData?.has_api_token;

	return (
		<div id="sc-nav" style={{ '--sc-tabs-min-width': '0' }}>
			{TABS.filter((item) => {
				if (item.requiresToken && !hasApiToken) return false;
				return true;
			}).map((item) => (
				<SidebarTab
					key={item.tab}
					tab={item.tab}
					icon={item.icon}
					label={item.label}
					currentTab={currentTab}
					badge={item.badge}
					iconStyle={item.iconStyle}
				/>
			))}
		</div>
	);
}
