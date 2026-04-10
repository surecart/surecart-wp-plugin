/**
 * useProductsNavigation — SPA navigation for the products admin page.
 *
 * Thin wrapper around the reusable useAdminSpaNavigation hook.
 */
import useAdminSpaNavigation from '../hooks/useAdminSpaNavigation';

export default function useProductsNavigation() {
	return useAdminSpaNavigation('sc-products');
}
