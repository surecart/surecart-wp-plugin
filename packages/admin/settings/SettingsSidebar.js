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
	const { href, onClick } = useLink(params, { replace: true });

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
 * Sidebar navigation for settings.
 */
export default function SettingsSidebar({ currentTab }) {
	const hasApiToken = !!window.scSettingsData?.has_api_token;
	const showLearn = !!window.scSettingsData?.show_learn;

	return (
		<div id="sc-nav" style={{ '--sc-tabs-min-width': '0' }}>
			{hasApiToken && (
				<>
					<SidebarTab
						tab=""
						icon="sliders"
						label={__('Store Settings', 'surecart')}
						currentTab={currentTab}
					/>
					<SidebarTab
						tab="brand"
						icon="pen-tool"
						label={__('Design & Branding', 'surecart')}
						currentTab={currentTab}
					/>
					<SidebarTab
						tab="order"
						icon="shopping-bag"
						label={__('Orders & Invoices', 'surecart')}
						currentTab={currentTab}
					/>
					<SidebarTab
						tab="abandoned_checkout"
						icon="shopping-cart"
						label={__('Abandoned Checkout', 'surecart')}
						currentTab={currentTab}
					/>
					<SidebarTab
						tab="customer_notification_protocol"
						icon="bell"
						label={__('Notifications', 'surecart')}
						currentTab={currentTab}
					/>
					<SidebarTab
						tab="subscription_protocol"
						icon="refresh-ccw"
						label={__('Subscriptions', 'surecart')}
						currentTab={currentTab}
					/>
					<SidebarTab
						tab="subscription_preservation"
						icon="bar-chart-2"
						label={__('Subscription Saver', 'surecart')}
						currentTab={currentTab}
					/>
					<SidebarTab
						tab="dynamic_pricing"
						icon="badge-percent"
						label={__('Dynamic Pricing', 'surecart')}
						currentTab={currentTab}
					/>
					<SidebarTab
						tab="affiliation_protocol"
						icon="mouse-pointer"
						label={__('Affiliates', 'surecart')}
						currentTab={currentTab}
						iconStyle={{
							fontSize: '18px',
							width: '18px',
							strokeWidth: '4',
						}}
					/>
					<SidebarTab
						tab="review_protocol"
						icon="star"
						label={__('Reviews', 'surecart')}
						currentTab={currentTab}
						badge
					/>
					<SidebarTab
						tab="tax_protocol"
						icon="tag"
						label={__('Taxes', 'surecart')}
						currentTab={currentTab}
					/>
					<SidebarTab
						tab="shipping_protocol"
						icon="truck"
						label={__('Shipping', 'surecart')}
						currentTab={currentTab}
					/>
					<SidebarTab
						tab="processors"
						icon="credit-card"
						label={__('Payment Processors', 'surecart')}
						currentTab={currentTab}
					/>
					<SidebarTab
						tab="display_currency"
						icon="dollar-sign"
						label={__('Currencies', 'surecart')}
						currentTab={currentTab}
					/>
					<SidebarTab
						tab="export"
						icon="layers"
						label={__('Data Export', 'surecart')}
						currentTab={currentTab}
						iconStyle={{
							fontSize: '18px',
							width: '18px',
							strokeWidth: '4',
						}}
					/>
					<SidebarTab
						tab="integrations"
						icon="zap"
						label={__('Integrations', 'surecart')}
						currentTab={currentTab}
						iconStyle={{
							width: '18px',
							height: '18px',
							opacity: '0.7',
						}}
					/>
					{showLearn && (
						<SidebarTab
							tab="learn"
							icon="book-open"
							label={__('Learn', 'surecart')}
							currentTab={currentTab}
						/>
					)}
				</>
			)}

			<SidebarTab
				tab="connection"
				icon="upload-cloud"
				label={__('Connection', 'surecart')}
				currentTab={currentTab}
				iconStyle={{
					fontSize: '18px',
					width: '18px',
					strokeWidth: '4',
				}}
			/>
			<SidebarTab
				tab="advanced"
				icon="sliders"
				label={__('Advanced', 'surecart')}
				currentTab={currentTab}
				iconStyle={{
					fontSize: '18px',
					width: '18px',
					strokeWidth: '4',
				}}
			/>
		</div>
	);
}
