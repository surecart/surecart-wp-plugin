<?php
$collapse_after = max( 1, (int) ( $attributes['collapseAfter'] ?? 2 ) );
$expanded       = (bool) ( $attributes['expanded'] ?? false );

return 'file:./view.php';
