<?php
$rel        = ! empty( $attributes['rel'] ) ? $attributes['rel'] : '';
$text_align = ! empty( $attributes['textAlign'] ) ? 'has-text-align-' . $attributes['textAlign'] : 'has-text-align-left';

return 'file:./view.php';
