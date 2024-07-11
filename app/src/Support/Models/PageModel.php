<?php

namespace SureCart\Support\Models;

use SureCart\Models\Model;
use SureCart\Support\Contracts\PageModel as PageModelContract;

/**
 * The Page model abstract class.
 */
abstract class PageModel extends Model implements PageModelContract {
	/**
	 * Get SEO Meta Data for the model.
	 *
	 * @return string
	 */
	public function getSeoMetaData() {
		$seoMetaData = '';

		// Primary Meta
		$seoMetaData .= '<meta name="description" content="' . esc_attr( sanitize_text_field( $this->meta_description ) ) . '">' . PHP_EOL;

		// Open Graph
		$seoMetaData .= '<meta property="og:locale" content="' . esc_attr( get_locale() ) . '" />' . PHP_EOL;
		$seoMetaData .= '<meta property="og:type" content="website" />' . PHP_EOL;
		$seoMetaData .= '<meta property="og:title" content="' . esc_attr( $this->page_title ) . '" />' . PHP_EOL;
		$seoMetaData .= '<meta property="og:description" content="' . esc_attr( sanitize_text_field( $this->meta_description ) ) . '" />' . PHP_EOL;
		$seoMetaData .= '<meta property="og:url" content="' . esc_url( $this->permalink ) . '" />' . PHP_EOL;
		$seoMetaData .= '<meta property="og:site_name" content="' . get_bloginfo('name') . '" />' . PHP_EOL;

		if ( ! empty( $this->getImageUrl( 800 ) ) ) {
			$seoMetaData .= '<meta property="og:image" content="' . esc_url( $this->getImageUrl( 800 ) ) . '" />' . PHP_EOL;
		}

		return $seoMetaData;
	}
}
