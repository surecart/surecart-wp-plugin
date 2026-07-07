<?php

namespace SureCart\Controllers\Admin;

/**
 * Shared plumbing for admin pages that dual-render between the new React
 * DataViews SPA and the legacy WP_List_Table controller.
 *
 * Consumers implement `renderSpaView()` and `renderWpListView()`; the trait
 * owns the feature-flag check, `index()` routing, and SPA-shell rendering.
 */
trait RendersEnhancedAdminView {
	/**
	 * Render the SPA shell view for this admin page.
	 *
	 * Must enqueue the scripts controller and return the shell response
	 * — typically by calling `renderSpaShell()`.
	 *
	 * @return \SureCartCore\Responses\ResponseInterface
	 */
	abstract protected function renderSpaView();

	/**
	 * Render the legacy WP_List_Table view for this admin page.
	 *
	 * @return \SureCartCore\Responses\ResponseInterface
	 */
	abstract protected function renderWpListView();

	/**
	 * Render the appropriate view based on the `surecart_enhanced_admin_views` feature flag.
	 */
	public function index() {
		return $this->isEnhancedAdminViewsEnabled() ? $this->renderSpaView() : $this->renderWpListView();
	}

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
	protected function renderSpaShell( string $view, ?string $breadcrumb_key = null, ?string $title = null ) {
		if ( null !== $breadcrumb_key && null !== $title ) {
			$this->withHeader(
				[
					'breadcrumbs'         => [
						$breadcrumb_key => [ 'title' => $title ],
					],
					'enhanced_view_promo' => $this->currentAdminPageUrl(),
				]
			);
		}

		return \SureCart::view( $view );
	}

	/**
	 * Get the URL of the current admin page, for redirecting back after toggling enhanced views.
	 *
	 * @return string
	 */
	private function currentAdminPageUrl(): string {
		$page = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return $page ? admin_url( 'admin.php?page=' . $page ) : admin_url();
	}

	/**
	 * Whether the React DataViews experience is enabled.
	 *
	 * @return bool
	 */
	public function isEnhancedAdminViewsEnabled(): bool {
		return (bool) get_option( 'surecart_enhanced_admin_views', true );
	}
}
