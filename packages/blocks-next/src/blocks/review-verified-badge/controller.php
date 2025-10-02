<?php
if ( empty( $block->context['review'] ) ) {
	return;
}

if ( ! $block->context['review']->verified ?? false ) {
	return;
}

return 'file:./view.php';
