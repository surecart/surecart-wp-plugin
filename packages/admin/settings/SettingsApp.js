/**
 * WordPress dependencies
 */
import { Suspense, lazy } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useLocation } from '../router';
import ErrorBoundary from '../components/error-boundary';
import SettingsSidebar from './SettingsSidebar';

/**
 * Lazy-loaded tab components.
 */
const tabs = {
	'': lazy(() => import('./account/AccountSettings')),
	brand: lazy(() => import('./brand/BrandSettings')),
	order: lazy(() => import('./order/OrderProtocol')),
	abandoned_checkout: lazy(() => import('./abandoned/AbandonedSettings')),
	customer_notification_protocol: lazy(() =>
		import('./customer/CustomerSettings')
	),
	subscription_protocol: lazy(() =>
		import('./subscription/SubscriptionSettings')
	),
	subscription_preservation: lazy(() =>
		import('./subscription-preservation/PreservationSettings')
	),
	dynamic_pricing: lazy(() =>
		import('./dynamic-pricing/DynamicPricingSettings')
	),
	affiliation_protocol: lazy(() =>
		import('./affiliation-protocol/AffiliationProtocolSettings')
	),
	review_protocol: lazy(() =>
		import('./review-protocol/ReviewProtocolSettings')
	),
	tax_protocol: lazy(() => import('./tax/TaxSettings')),
	tax_region: lazy(() => import('./tax-region/TaxRegionSettings')),
	shipping_protocol: lazy(() => import('./shipping/ShippingSettings')),
	shipping_profile: lazy(() => import('./shipping/profile/ShippingProfile')),
	processors: lazy(() => import('./processors/ProcessorSettings')),
	export: lazy(() => import('./export/ExportSettings')),
	display_currency: lazy(() =>
		import('./display-currency/DisplayCurrencySettings')
	),
	connection: lazy(() => import('./connection/ConnectionSettings')),
	integrations: lazy(() => import('./integrations/Integrations')),
	learn: lazy(() => import('./learn/LearnSettings')),
	advanced: lazy(() => import('./advanced/AdvancedSettings')),
};

/**
 * Skeleton block matching the SettingsBox loading pattern.
 */
const SkeletonBlock = ({ titleWidth = '30%', bodyWidth = '40%' }) => (
	<div>
		<sc-skeleton
			style={{
				width: titleWidth,
				marginBottom: '1.5em',
				display: 'inline-block',
			}}
		></sc-skeleton>
		<sc-card>
			<div>
				<sc-skeleton
					style={{
						width: '100%',
						marginBottom: '15px',
						display: 'inline-block',
					}}
				></sc-skeleton>
				<sc-skeleton
					style={{ width: bodyWidth, display: 'inline-block' }}
				></sc-skeleton>
			</div>
		</sc-card>
	</div>
);

/**
 * Loading placeholder for lazy-loaded tabs.
 */
const TabLoading = () => (
	<div style={{ display: 'grid', gap: '3em' }}>
		<SkeletonBlock titleWidth="30%" bodyWidth="40%" />
		<SkeletonBlock titleWidth="25%" bodyWidth="60%" />
	</div>
);

/**
 * Sub-route lookup: maps "tab:type" combinations to resolved tab keys.
 */
const SUB_ROUTES = {
	'tax_protocol:region': 'tax_region',
	'shipping_protocol:shipping_profile': 'shipping_profile',
};

/**
 * Tabs that don't require an API token.
 */
const NO_TOKEN_TABS = ['connection', 'advanced'];

/**
 * Main Settings App with client-side routing.
 */
export default function SettingsApp() {
	const location = useLocation();

	const hasApiToken = !!window.scSettingsData?.has_api_token;

	// Determine active tab from URL params.
	// Fall back to connection tab when no API token and tab requires one.
	let currentTab = location?.params?.tab || '';
	if (!hasApiToken && !NO_TOKEN_TABS.includes(currentTab)) {
		currentTab = 'connection';
	}

	const subKey = `${currentTab}:${location?.params?.type || ''}`;
	const resolvedTab = SUB_ROUTES[subKey] || currentTab;

	const TabComponent = tabs[resolvedTab];

	return (
		<div id="sc-settings-content">
			<SettingsSidebar currentTab={currentTab} />
			<div className="sc-container">
				<div className="sc-content" id="app">
					<ErrorBoundary>
						<Suspense fallback={<TabLoading />}>
							{TabComponent ? (
								<TabComponent />
							) : (
								<div>
									{__('Settings tab not found.', 'surecart')}
								</div>
							)}
						</Suspense>
					</ErrorBoundary>
				</div>
			</div>
		</div>
	);
}
