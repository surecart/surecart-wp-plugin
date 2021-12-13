@component('web.dashboard.templates.index', [
	'tab' => $tab,
	'heading' => __('Orders', 'checkout_engine')
])
	@foreach($orders as $key => $order)
		<ce-customer-order id="<?php echo esc_attr("order-$order->id"); ?>">
			<ce-button slot="action" href="<?php echo esc_url(add_query_arg(['id' => $order->id])); ?>" size="small">{{__('View Order', 'checkout_engine')}}</ce-button>
		</ce-customer-order>
		<script>
			var component = document.querySelector('<?php echo esc_attr("#order-$order->id"); ?>');
			component.order = <?php echo wp_json_encode($order); ?>;
		</script>
	@endforeach
@endcomponent
