@component('web.dashboard.templates.index', [
	'tab' => $tab,
	'heading' => __('Charges', 'checkout_engine')
])

	@foreach($charges as $key => $charge)
		<ce-customer-subscription id="<?php echo esc_attr("subscription-$subscription->id"); ?>">
			<ce-button slot="action" href="">asdf</ce-button>
		</ce-customer-subscription>
		<script>
			var component = document.querySelector('<?php echo esc_attr("#subscription-$subscription->id"); ?>');
			component.subscription = <?php echo wp_json_encode($subscription); ?>;
		</script>
	@endforeach

@endcomponent
