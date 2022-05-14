<?php

namespace SureCart\Integrations\LearnDash;

/**
 * Controls the LearnDash integration.
 */
class LearnDashService {
	/**
	 * Integration slug.
	 *
	 * @var string
	 */
	protected $slug = 'learndash-course';

	/**
	 * The model to show the integration provider.
	 *
	 * @var string
	 */
	protected $model = 'product';

	/**
	 * Bootstrap actions.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_filter( "surecart/integrations/providers/list/{$this->model}", [ $this, 'addToProviderList' ], 9 );
		add_filter( "surecart/integrations/providers/{$this->slug}/{$this->model}/items", [ $this, 'getItems' ], 9 );
	}

	/**
	 * Add to provider list.
	 *
	 * @param array $list List of providers for the model.
	 *
	 * @return array
	 */
	public function addToProviderList( $list ) {
		$list[] = [
			'slug' => $this->slug,
			'name' => __( 'LearnDash Course', 'surecart' ),
			'logo' => '<svg viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="65" height="65" rx="5" fill="#235AF4"/>
				<path d="M46.7107 7.55741C43.9008 7.55741 41.6419 9.84281 41.6419 12.6856V54.9933C41.6419 55.495 42.0826 55.9409 42.5785 55.9409C47.6474 55.9409 51.7796 51.7603 51.7796 46.6321V12.6856C51.7796 9.84281 49.5207 7.55741 46.7107 7.55741Z" fill="white"/>
				<path d="M31.7245 20.2107C28.9146 20.2107 26.6556 22.4961 26.6556 25.3389V54.9933C26.6556 55.495 27.0964 55.9409 27.5923 55.9409C32.6612 55.9409 36.7934 51.7603 36.7934 46.6321V25.3389C36.7934 22.4961 34.5344 20.2107 31.7245 20.2107Z" fill="white"/>
				<path d="M17.2893 34.146C14.4793 34.146 12.2204 36.4314 12.2204 39.2742V54.9933C12.2204 55.495 12.6612 55.9409 13.157 55.9409C18.2259 55.9409 22.3581 51.7603 22.3581 46.6321V39.2742C22.3581 36.4314 20.0992 34.146 17.2893 34.146Z" fill="white"/>
				</svg>',
		];
		return $list;
	}

	/**
	 * Get the specific course id
	 *
	 * @param array $items The integration items.
	 *
	 * @return array The items for the integration.
	 */
	public function getItems( $items ) {
		if ( function_exists( 'learndash_get_posts_by_price_type' ) ) {
			$posts   = \learndash_get_posts_by_price_type( 'sfwd-courses', '', true );
			$items[] = $posts;
		}
		$items[] = [
			'label' => __( 'Test Course', 'surecart' ),
			'value' => 12,
		];
		return $items;
	}
}
