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
	upgrade: lazy(() => import('./upgrade/UpgradeSettings')),
};

/**
 * Loading placeholder for lazy-loaded tabs.
 * Matches the SettingsBox skeleton pattern used across the app.
 */
const TabLoading = () => (
	<div style={{ display: 'grid', gap: '3em' }}>
		{/* Mimic a SettingsBox header + content skeleton */}
		<div>
			<sc-skeleton
				style={{
					width: '30%',
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
						style={{
							width: '40%',
							display: 'inline-block',
						}}
					></sc-skeleton>
				</div>
			</sc-card>
		</div>
		<div>
			<sc-skeleton
				style={{
					width: '25%',
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
						style={{
							width: '60%',
							display: 'inline-block',
						}}
					></sc-skeleton>
				</div>
			</sc-card>
		</div>
	</div>
);

/**
 * Main Settings App with client-side routing.
 */
export default function SettingsApp() {
	const location = useLocation();

	// Determine active tab from URL params.
	const currentTab = location?.params?.tab || '';

	// Handle sub-routes: tax_protocol with type=region -> tax_region
	const resolvedTab = (() => {
		if (
			currentTab === 'tax_protocol' &&
			location?.params?.type === 'region'
		) {
			return 'tax_region';
		}
		if (
			currentTab === 'shipping_protocol' &&
			location?.params?.type === 'shipping_profile'
		) {
			return 'shipping_profile';
		}
		return currentTab;
	})();

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
