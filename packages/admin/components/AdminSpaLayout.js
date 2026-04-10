/**
 * AdminSpaLayout — Shared SPA wrapper for SureCart admin pages.
 *
 * Handles:
 * - Intercepting the PHP-rendered "Add New" button click for SPA navigation
 * - Toggling visibility of PHP-rendered headers when switching between list and edit/create
 * - Intercepting admin sidebar link clicks for same-page SPA navigation
 *
 * @param {Object}   props
 * @param {Object}   props.navigation   - SPA navigation from useAdminSpaNavigation.
 * @param {Function} props.renderList   - Renders the list view component.
 * @param {Function} props.renderDetail - Renders the create/edit view component.
 */
import { useEffect } from 'react';

export default function AdminSpaLayout({ navigation, renderList, renderDetail }) {
	// Intercept the PHP-rendered "Add New" button to use SPA navigation.
	useEffect(() => {
		const addNewButton = document.querySelector(
			'[data-test-id="add-new-button"]'
		);
		if (!addNewButton) {
			return;
		}

		const handleClick = (e) => {
			e.preventDefault();
			navigation.goToCreate();
		};

		addNewButton.addEventListener('click', handleClick);
		return () => addNewButton.removeEventListener('click', handleClick);
	}, [navigation.goToCreate]);

	// Toggle visibility of PHP-rendered header elements based on current view.
	useEffect(() => {
		const scAdminHeader = document.getElementById('sc-admin-header');
		const headerWrapper = document.querySelector(
			'.wrap > .wp-heading-inline'
		);
		const addNewButton = document.querySelector(
			'[data-test-id="add-new-button"]'
		);
		const headerEnd = document.querySelector('.wrap > .wp-header-end');

		const showHeader = navigation.isList;

		if (scAdminHeader) {
			scAdminHeader.style.display = showHeader ? '' : 'none';
		}
		if (headerWrapper) {
			headerWrapper.style.display = showHeader ? '' : 'none';
		}
		if (addNewButton) {
			addNewButton.style.display = showHeader ? '' : 'none';
		}
		if (headerEnd) {
			headerEnd.style.display = showHeader ? '' : 'none';
		}
	}, [navigation.isList]);

	// Intercept admin sidebar links that point to this page for SPA navigation.
	useEffect(() => {
		const pageSlug = navigation.pageSlug;
		if (!pageSlug) {
			return;
		}

		const handleSidebarClick = (e) => {
			const link = e.target.closest('a');
			if (!link) {
				return;
			}

			const href = link.getAttribute('href');
			if (!href) {
				return;
			}

			// Match links like "admin.php?page=sc-products" (exact match, no action param).
			const match = href.match(
				/admin\.php\?page=([\w-]+)(?:&|$)/
			);
			if (match && match[1] === pageSlug && !href.includes('action=')) {
				e.preventDefault();
				navigation.goToList();
			}
		};

		const sidebar = document.getElementById('adminmenu');
		if (sidebar) {
			sidebar.addEventListener('click', handleSidebarClick);
			return () =>
				sidebar.removeEventListener('click', handleSidebarClick);
		}
	}, [navigation.pageSlug, navigation.goToList]);

	if (navigation.isList) {
		return renderList(navigation);
	}

	return renderDetail(navigation);
}
