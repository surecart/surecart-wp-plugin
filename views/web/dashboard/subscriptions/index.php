<ce-subscriptions-list id="customer-subscriptions-list">
	<span slot="empty"><?php echo wp_kses_post( $empty ?? '' ); ?></span>
</ce-subscriptions-list>

<?php
\CheckoutEngine::assets()->addComponentData(
	'ce-subscriptions-list',
	'#customer-subscriptions-list',
	[
		'query' => $query ?? [],
	]
);
?>
