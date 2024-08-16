<?php

use SureCart\Models\Blocks\ProductListBlock;

$controller = new ProductListBlock( $block );
$query      = $controller->query();

// If we have a button or a link, we need to wrap the content in a form element.
$html       = new \WP_HTML_Tag_Processor( $content );
$has_button = (bool) $html->next_tag( 'button' );
$html       = new \WP_HTML_Tag_Processor( $content );
$has_link   = (bool) $html->next_tag( 'a' );
$html_tag   = $has_link || $has_button ? 'form' : 'a';

return 'file:./view.php';
