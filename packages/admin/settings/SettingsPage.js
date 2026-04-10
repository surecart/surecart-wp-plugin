/**
 * SettingsPage — SPA shell wrapper for the Settings page.
 *
 * Handles:
 * - Injecting/removing settings-specific CSS when mounted/unmounted
 * - Rendering the settings header (React-rendered, replacing PHP partial)
 * - Wrapping SettingsApp in the RouterProvider context it expects
 */
import { useEffect } from '@wordpress/element';

import ErrorBoundary from '../components/error-boundary';
import { RouterProvider } from '../router';
import SettingsHeader from './SettingsHeader';
import SettingsApp from './SettingsApp';

/**
 * Settings-specific CSS that modifies the WordPress admin layout.
 *
 * These styles are injected into <head> when the settings page is active
 * and removed when navigating away to another SPA page.
 */
const SETTINGS_STYLES = `
/* Brand color overrides — mirrors BrandColorMiddleware.
   Ensures brand theme is applied even when SPA-navigating
   from a page that didn't load the brand_colors middleware. */
:root:root {
	--sc-color-primary-500: var(--sc-color-brand-primary);
	--sc-focus-ring-color-primary: var(--sc-color-brand-primary);
	--sc-input-border-color-focus: var(--sc-color-brand-primary);
	--sc-color-gray-900: var(--sc-color-brand-heading);
	--sc-color-gray-800: var(--sc-color-brand-text);
	--sc-tab-active-color: var(--sc-color-brand-primary);
	--sc-tab-active-background: transparent;
	--sc-tag-default-background-color: var(--sc-color-brand-main-background);
	--sc-tag-default-border-color: var(--sc-color-brand-stroke);
	--sc-tag-default-color: var(--sc-color-brand-body);
	--sc-stacked-list-row-hover-color: var(--sc-color-brand-main-background);
	--sc-color-primary-text: white;
}
sc-tab:not([active]):not(:hover) sc-icon {
	color: var(--sc-color-gray-500);
}
sc-tab::part(base) {
	font-weight: 400;
}
#wpbody-content, #wpcontent {
	padding: 0 !important;
	font-size: 14px;
	color: var(--sc-color-brand-body);
}
.sc-item-stick-bottom {
	padding-top: var(--sc-spacing-large);
}
@media screen and (min-width: 600px) {
	.sc-item-stick-bottom {
		position: sticky;
		top: 135px;
	}
}
#wpfooter {
	display: none;
}
body {
	background: var(--sc-color-brand-main-background);
}
#sc-settings-container {
	min-height: calc(100vh - 66px);
	top: 0;
	width: 100% !important;
	left: 0;
	display: flex;
	flex-direction: column;
}
#sc-settings-content {
	display: flex;
	flex: 1;
}
#sc-settings-content::before {
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
	background: #ffffff;
	content: " ";
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	-webkit-transform-origin: right;
	-ms-transform-origin: right;
	transform-origin: right;
	width: 450px;
	border-right: 1px solid var(--sc-color-gray-200);
	z-index: -1;
}
#sc-nav {
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 2px;
	width: 100%;
	max-width: 290px;
	position: relative;
	box-sizing: border-box;
}
@media screen and (max-width: 960px) {
	#sc-settings-content::before {
		width: 330px;
	}
}
@media screen and (max-width: 782px) {
	#sc-settings-content {
		flex-direction: column;
	}
	#sc-nav {
		width: 100%;
		max-width: none;
		background: white;
		border-bottom: 1px solid var(--sc-color-gray-200);
	}
	#sc-settings-content::before {
		display: none;
	}
}
#sc-settings {
	flex: 1;
}
.surecart-cta {
	--sc-card-border-color: var(--sc-color-primary-500);
}
.sc-container {
	width: 100%;
}
.sc-content {
	margin-left: auto;
	margin-right: auto;
	max-width: var(--sc-settings-content-width, 768px);
	padding: 2rem;
	display: flex;
	flex-direction: column;
	gap: var(--sc-spacing-large);
}
.sc-section-heading {
	margin-bottom: 1.5rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid rgba(229, 231, 235, 1);
	padding-bottom: 1rem;
}
.sc-section-heading h3 {
	margin: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 1rem;
	line-height: 1.75rem;
	font-weight: 600;
	color: rgba(17, 24, 39, 1);
	display: flex;
	align-items: center;
	gap: 0.5em;
	color: var(--sc-color-gray-900);
}
.sc-section-heading sc-icon {
	font-size: 1.3rem;
}
sc-icon {
	width: 18px;
	height: 18px;
}
sc-tab, sc-icon, sc-breadcrumbs, sc-breadcrumb, sc-button, sc-card, sc-tag, sc-dashboard-module, sc-form {
	visibility: hidden;
	opacity: 0;
	transition: opacity 0.2s ease-in-out;
}
sc-tab.hydrated,
sc-icon.hydrated,
sc-breadcrumbs.hydrated,
sc-breadcrumb.hydrated,
sc-button.hydrated,
sc-card.hydrated,
sc-tag.hydrated,
sc-dashboard-module.hydrated,
sc-form.hydrated {
	visibility: inherit;
	opacity: 1;
}
#sc-settings-header {
	box-sizing: border-box;
	width: 100%;
	position: sticky;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 20px;
	background: #fff;
	border-bottom: 1px solid var(--sc-color-gray-200);
	gap: 1.2em;
	z-index: 9;
}
@media screen and (min-width: 600px) {
	.sc-settings-header-container {
		position: sticky;
		top: 32px;
		z-index: 9989;
	}
}
`;

const STYLE_TAG_ID = 'sc-settings-spa-styles';

export default function SettingsPage() {
	// Inject settings-specific styles on mount, remove on unmount.
	useEffect(() => {
		let styleEl = document.getElementById(STYLE_TAG_ID);
		if (!styleEl) {
			styleEl = document.createElement('style');
			styleEl.id = STYLE_TAG_ID;
			styleEl.textContent = SETTINGS_STYLES;
			document.head.appendChild(styleEl);
		}

		return () => {
			const el = document.getElementById(STYLE_TAG_ID);
			if (el) {
				el.remove();
			}
		};
	}, []);

	return (
		<div id="sc-settings-container">
			<SettingsHeader />
			<ErrorBoundary>
				<RouterProvider>
					<SettingsApp />
				</RouterProvider>
			</ErrorBoundary>
		</div>
	);
}
