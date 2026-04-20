<?php

namespace SureCart\Controllers\Admin;

/**
 * Shared plumbing for admin pages that dual-render between the new React
 * DataViews SPA and the legacy WP_List_Table controller.
 *
 * Consumers implement `renderLegacyView()`; this trait owns the feature-flag
 * check, script-enqueue hook, and SPA-shell rendering.
 */
trait RendersEnhancedAdminView {
	/**
	 * Enqueue the SPA bundle on admin_enqueue_scripts.
	 *
	 * @param string $scriptsController FQN of the scripts controller (ProductScriptsController::class etc.).
	 * @return void
	 */
	protected function enqueueSpaScripts( string $scriptsController ): void {
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( $scriptsController, 'enqueue' ) );
	}

	/**
	 * Render the SPA shell view, optionally with a breadcrumb header.
	 *
	 * Pass a breadcrumb key + title for list views where the PHP-rendered
	 * admin header bar should show "Logo → Title". Omit both for edit/create
	 * views — the React detail components render their own breadcrumbs, so a
	 * second PHP-rendered bar would duplicate them.
	 *
	 * @param string      $view          View slug passed to \SureCart::view().
	 * @param string|null $breadcrumbKey Breadcrumb array key (e.g. 'products').
	 * @param string|null $title         Localized breadcrumb title.
	 * @return \SureCartCore\Responses\ResponseInterface
	 */
	protected function renderSpaView( string $view, ?string $breadcrumbKey = null, ?string $title = null ) {
		if ( null !== $breadcrumbKey && null !== $title ) {
			$this->withHeader(
				[
					'breadcrumbs' => [
						$breadcrumbKey => [ 'title' => $title ],
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
