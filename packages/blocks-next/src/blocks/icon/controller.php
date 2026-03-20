<?php
$icon_name    = $attributes['icon_name'] ?? 'star';
$size         = $attributes['size'] ?? 24;
$width        = $attributes['width'] ?? '';
$height       = $attributes['height'] ?? '';
$stroke_width = $attributes['stroke_width'] ?? 2;
$alignment    = $attributes['alignment'] ?? '';
$link_url     = $attributes['link_url'] ?? '';
$link_target  = $link_url ? $attributes['link_target'] : '';
$link_rel     = $link_url ? $attributes['link_rel'] : '';
$nofollow     = $attributes['nofollow'] ?? false;
$html_tag     = $link_url ? 'a' : 'div';

// Return the view.
return 'file:./view.php';
