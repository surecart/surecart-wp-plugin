<?php

namespace SureCart\Controllers\Admin;

use Exception;

/**
 * Shared plumbing for admin pages that dual-render between the new React
 * DataViews SPA and the legacy WP_List_Table controller.
 *
 * Consumers implement `renderWpListView()`; this trait owns the feature-flag
 * check, script-enqueue hook, and SPA-shell rendering.
 */
trait RendersEnhancedAdminView {
	/**
	 * Enqueue the SPA bundle on admin_enqueue_scripts.
	 *
	 * @param string $scripts_controller FQN of the scripts controller (ProductScriptsController::class etc.).
	 * @return void
	 */
	protected function enqueueSpaScripts( string $scripts_controller ): void {
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( $scripts_controller, 'enqueue' ) );
	}

	/**
	 * Render the SPA shell view for this admin page.
	 *
	 * Must be implemented by the consuming controller to return the appropriate view (e.g. 'admin/products/spa') with the appropriate breadcrumb args.
	 *
	 * @return \SureCartCore\Responses\ResponseInterface The response from rendering the SPA view.
	 *
	 * @throws Exception If not implemented by the consuming controller.
	 */
	protected function renderSpaView() {
		throw new Exception( 'renderSpaView() must be implemented by the consuming controller to render the SPA view.' );
	}


	/**
	 * Render the legacy WP_List_Table view for this admin page.
	 *
	 * Must be implemented by the consuming controller to return the appropriate legacy view.
	 *
	 * @return \SureCartCore\Responses\ResponseInterface The response from rendering the legacy view.
	 *
	 * @throws Exception If not implemented by the consuming controller.
	 */
	protected function renderWpListView() {
		throw new Exception( 'renderWpListView() must be implemented by the consuming controller to render the legacy view.' );
	}

	/**
	 * Render the appropriate view based on the `surecart_enhanced_admin_views` feature flag.
	 */
	public function index() {
		return $this->isEnhancedAdminViewsEnabled() ? $this->renderSpaView() : $this->renderWpListView();
	}

	/**
	 * Render the SPA shell view, optionally with a breadcrumb header.
	 *
	 * Pass a breadcrumb key + title for list views where the PHP-rendered
	 * admin header bar should show "Logo → Title". Omit both for edit/create
	 * views — the React detail components render their own breadcrumbs, so a
	 * second PHP-rendered bar would duplicate them.
	 *
	 * @param string      $view           View slug passed to \SureCart::view().
	 * @param string|null $breadcrumb_key Breadcrumb array key (e.g. 'products').
	 * @param string|null $title          Localized breadcrumb title.
	 *
	 * @return \SureCartCore\Responses\ResponseInterface
	 */
	protected function render( string $view, ?string $breadcrumb_key = null, ?string $title = null ) {
		if ( null !== $breadcrumb_key && null !== $title ) {
			$this->withHeader(
				[
					'breadcrumbs' => [
						$breadcrumb_key => [ 'title' => $title ],
					],
				]
			);
		}

		return \SureCart::view( $view );
	}

	/**
	 * Whether the React DataViews experience is enabled.
	 *
	 * @return bool
	 */
	public function isEnhancedAdminViewsEnabled(): bool {
		return (bool) get_option( 'surecart_enhanced_admin_views', false );
	}
}
