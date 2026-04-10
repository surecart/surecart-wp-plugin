/**
 * SpaShell — Unified SPA shell for SureCart admin pages.
 *
 * Manages cross-page navigation between Products, Collections, etc.
 * within a single React root — no full page reloads.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getQueryArgs, addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import PAGES, { getSpaPageSlugs } from './page-registry';
import useAdminSpaNavigation from '../hooks/useAdminSpaNavigation';

/**
 * Parse the current page slug from the URL.
 */
function getCurrentPageSlug() {
	const args = getQueryArgs(window.location.href);
	return args.page || null;
}

export default function SpaShell() {
	const [pageSlug, setPageSlug] = useState(getCurrentPageSlug);

	// Create navigation for the current page.
	const navigation = useAdminSpaNavigation(pageSlug);

	// Memoize the set of SPA page slugs for sidebar interception.
	const spaPageSlugs = useMemo(() => getSpaPageSlugs(), []);

	/**
	 * Navigate to a different SPA page (cross-page).
	 */
	const navigateToPage = useCallback(
		(newPageSlug) => {
			const url = addQueryArgs('admin.php', { page: newPageSlug });
			window.history.pushState({ page: newPageSlug }, '', url);
			setPageSlug(newPageSlug);
		},
		[]
	);

	// Listen for browser back/forward (may cross pages).
	useEffect(() => {
		const onPopState = () => {
			const newSlug = getCurrentPageSlug();
			if (newSlug !== pageSlug) {
				setPageSlug(newSlug);
			}
		};
		window.addEventListener('popstate', onPopState);
		return () => window.removeEventListener('popstate', onPopState);
	}, [pageSlug]);

	// Intercept sidebar clicks for any SPA-registered page.
	useEffect(() => {
		const sidebar = document.getElementById('adminmenu');
		if (!sidebar) {
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

			// Match admin.php?page=xxx links (no action param = list view).
			const match = href.match(/admin\.php\?page=([\w-]+)(?:&|$)/);
			if (match && spaPageSlugs.includes(match[1]) && !href.includes('action=')) {
				e.preventDefault();
				e.stopPropagation();

				const targetSlug = match[1];

				// Check if the clicked link differs from the current URL
				// (e.g. clicking "Learn" tab link when already on Settings).
				const currentHref = window.location.pathname + window.location.search;
				const linkPath = href.startsWith('/') ? href : '/wp-admin/' + href;
				const isSameUrl = currentHref === linkPath;

				if (targetSlug === pageSlug && navigation.isList && isSameUrl) {
					// Already on this exact page/view — no-op.
					return;
				}

				// Push the full href to preserve extra params (e.g. tab=learn for Settings).
				window.history.pushState({ page: targetSlug }, '', href);

				if (targetSlug !== pageSlug) {
					// Cross-page navigation.
					setPageSlug(targetSlug);
				} else {
					// Same page — navigate to list view and notify sub-routers.
					navigation.goToList();
					window.dispatchEvent(new PopStateEvent('popstate'));
				}
			}
		};

		sidebar.addEventListener('click', handleSidebarClick);
		return () => sidebar.removeEventListener('click', handleSidebarClick);
	}, [spaPageSlugs, pageSlug, navigation.isList, navigation.goToList, navigateToPage]);

	// Update the sidebar active state when page changes.
	useEffect(() => {
		updateSidebarActiveState(pageSlug);
	}, [pageSlug]);

	// Determine if the current page is a single-component page (e.g. Settings).
	const isComponentPage = !!PAGES[pageSlug]?.component;

	// Update the PHP-rendered header based on the current page and view.
	useEffect(() => {
		const page = PAGES[pageSlug];
		const headerContainer = document.getElementById('sc-spa-index-header');
		const scAdminHeader = document.getElementById('sc-admin-header');

		if (!headerContainer) {
			return;
		}

		// Component-only pages manage their own layout — hide the shared headers.
		const showHeader = !isComponentPage && navigation.isList;

		// Toggle the entire index header visibility.
		headerContainer.style.display = showHeader ? '' : 'none';

		// Toggle the SureCart admin header (breadcrumb bar).
		if (scAdminHeader) {
			scAdminHeader.style.display = showHeader ? '' : 'none';
		}

		if (showHeader && page) {
			// Update the title.
			const titleEl = headerContainer.querySelector('.wp-heading-inline');
			if (titleEl) {
				titleEl.textContent = page.title;
			}

			// Update the "Add New" button.
			const addNewButton = headerContainer.querySelector(
				'[data-test-id="add-new-button"]'
			);
			if (addNewButton) {
				if (page.newLabel) {
					addNewButton.style.display = '';
					addNewButton.textContent = page.newLabel;
					addNewButton.href = addQueryArgs('admin.php', {
						page: pageSlug,
						action: 'edit',
					});
				} else {
					addNewButton.style.display = 'none';
				}
			}
		}
	}, [pageSlug, navigation.isList, isComponentPage]);

	// Toggle .wrap class on the app container to match original layout:
	// - List view: had .wrap (WordPress admin margins)
	// - Edit/Create view: no .wrap (full width, matching old edit.php)
	// - Component pages (Settings): no .wrap (own layout)
	useEffect(() => {
		const appContainer = document.getElementById('sc-admin-spa-app');
		if (!appContainer) {
			return;
		}

		if (navigation.isList && !isComponentPage) {
			appContainer.classList.add('wrap');
		} else {
			appContainer.classList.remove('wrap');
		}
	}, [navigation.isList, isComponentPage]);

	// Intercept "Add New" button click for SPA navigation.
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

	// Resolve the current page config.
	const page = PAGES[pageSlug];
	if (!page) {
		// Unknown page — shouldn't happen, but fallback gracefully.
		return null;
	}

	// Single-component pages (e.g. Settings) manage their own layout entirely.
	if (page.component) {
		const PageComponent = page.component;
		return <PageComponent navigation={navigation} />;
	}

	const { list: ListComponent, detail: DetailComponent } = page;

	if (navigation.isList) {
		return <ListComponent navigation={navigation} />;
	}

	return <DetailComponent navigation={navigation} />;
}

/**
 * Update the WordPress admin sidebar to reflect the active SPA page.
 *
 * WordPress highlights the active menu item via CSS classes. When we
 * SPA-navigate to a different page, we need to move those classes.
 *
 * @param {string} activePageSlug - The page slug to mark as active.
 */
function updateSidebarActiveState(activePageSlug) {
	const sidebar = document.getElementById('adminmenu');
	if (!sidebar) {
		return;
	}

	// Remove active classes from all submenu items.
	sidebar.querySelectorAll('.wp-submenu li').forEach((li) => {
		li.classList.remove('current');
		const link = li.querySelector('a');
		if (link) {
			link.classList.remove('current');
			link.removeAttribute('aria-current');
		}
	});

	// Find and activate the matching submenu item.
	sidebar.querySelectorAll('.wp-submenu a').forEach((link) => {
		const href = link.getAttribute('href');
		if (href && href.includes(`page=${activePageSlug}`) && !href.includes('action=')) {
			link.classList.add('current');
			link.setAttribute('aria-current', 'page');
			const li = link.closest('li');
			if (li) {
				li.classList.add('current');
			}
		}
	});
}
