/**
 * SettingsHeader — React-rendered header for the Settings SPA page.
 *
 * Replaces the PHP-rendered admin-settings-header.php partial when
 * Settings is running inside the unified SPA shell.
 */
import { __ } from '@wordpress/i18n';
import { useState, useCallback } from '@wordpress/element';

/**
 * Get settings data from localized script.
 */
function getSettingsData() {
	return window.scSettingsData || {};
}

export default function SettingsHeader() {
	const data = getSettingsData();
	const [clearing, setClearing] = useState(false);
	const [cacheCleared, setCacheCleared] = useState(false);

	/**
	 * Handle cache clear via form POST submission.
	 */
	const handleCacheClear = useCallback(
		async (e) => {
			e.preventDefault();
			if (clearing) return;
			setClearing(true);

			try {
				const formData = new FormData();
				formData.append('nonce', data.cache_nonce || '');

				const response = await fetch(data.cache_clear_url || '', {
					method: 'POST',
					body: formData,
					credentials: 'same-origin',
					redirect: 'manual', // don't follow redirects
				});

				// The server redirects on success. If we get any response, consider it done.
				if (response.ok || response.type === 'opaqueredirect' || response.status === 0) {
					setCacheCleared(true);
					setTimeout(() => setCacheCleared(false), 3000);
				}
			} catch {
				// Redirect-based endpoints may throw on manual redirect mode.
				// Consider the cache cleared.
				setCacheCleared(true);
				setTimeout(() => setCacheCleared(false), 3000);
			} finally {
				setClearing(false);
			}
		},
		[clearing, data.cache_nonce, data.cache_clear_url]
	);

	return (
		<div className="sc-settings-header-container">
			{cacheCleared && (
				<sc-alert open type="info" closable style={{ position: 'relative', zIndex: 10 }}>
					{__('Cache cleared.', 'surecart')}
				</sc-alert>
			)}

			{(data.claim_url || data.claim_expired) && (
				<sc-provisional-banner
					claim-url={data.claim_url || ''}
					expired={data.claim_expired ? 'true' : 'false'}
				></sc-provisional-banner>
			)}

			<div id="sc-settings-header">
				<sc-breadcrumbs style={{ fontSize: '16px' }}>
					<sc-breadcrumb>
						{data.logo_url && (
							<img
								style={{ display: 'block' }}
								src={data.logo_url}
								alt="SureCart"
								width="125"
							/>
						)}
					</sc-breadcrumb>
					<sc-breadcrumb href={data.settings_url || '#'}>
						{__('Settings', 'surecart')}
					</sc-breadcrumb>
				</sc-breadcrumbs>

				<sc-flex>
					<form onSubmit={handleCacheClear}>
						<sc-button
							type="default"
							size="small"
							outline
							submit
							loading={clearing || undefined}
						>
							{__('Clear Account Cache', 'surecart')}
						</sc-button>
					</form>
					<sc-button
						type="text"
						size="small"
						href="https://status.surecart.com"
						target="_blank"
					>
						{__('SureCart Status', 'surecart')}
						<sc-icon name="external-link" slot="suffix"></sc-icon>
					</sc-button>
					{data.version && (
						<sc-tag>
							{/* translators: Version number. */}
							{__('Version', 'surecart')} {data.version}
						</sc-tag>
					)}
				</sc-flex>
			</div>
		</div>
	);
}
