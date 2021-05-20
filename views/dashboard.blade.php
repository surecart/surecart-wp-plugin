<?php
/**
 * Dashboard View
 *
 * Layout: layouts/dashboard.php
 *
 * @package CheckoutEngine
 */

?>
<div class="checkout_engine__view">
	<h1><?php echo __( 'Dashboard', 'checkout_engine' ); ?></h1>
	<?php \CheckoutEngine::render( 'partials/example', [ 'message' => __( 'Hello World!', 'checkout_engine' ) ] ); ?>
</div>
