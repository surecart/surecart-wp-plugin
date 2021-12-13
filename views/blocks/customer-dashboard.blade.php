<ce-customer-dashboard></ce-customer-dashboard>


<ce-tab href="?tab=orders">
	<svg slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
	</svg>
	Orders
</ce-tab>
<ce-tab href="?tab=subscriptions">
	<svg slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
	</svg>
	Subscriptions
</ce-tab>


{{-- <ce-customer-dashboard customer-id="{{$customer_id}}">
	<ce-tab-group style="margin: 2em auto;">
		<ce-tab slot="nav" panel="orders">
		<svg slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
		</svg>
		Orders
		</ce-tab>

		<ce-tab slot="nav" panel="subscriptions">
			<svg slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
			</svg>
			Subscriptions
		</ce-tab>

		<ce-tab slot="nav" panel="charges">
			<svg slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
			</svg>
			Charges
		</ce-tab>

		<ce-tab slot="nav" panel="refunds">
			<svg slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
			</svg>
		Refunds
		</ce-tab>

		<ce-tab slot="nav" panel="payment-methods">
			<svg slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
			</svg>
			Payment Methods
		</ce-tab>


		<ce-tab slot="nav" panel="account">
			<svg slot="prefix" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			Account Details
		</ce-tab>

		<ce-tab-panel name="orders">
			<ce-heading>Orders</ce-heading>
			<ce-divider style="--spacing:var(--ce-spacing-medium)"></ce-divider>
			<ce-customer-orders></ce-customer-orders>
		</ce-tab-panel>
		<ce-tab-panel name="subscriptions">
			<ce-heading>Subscriptions</ce-heading>
		<ce-divider style="--spacing:var(--ce-spacing-medium)"></ce-divider>
		This is the custom tab panel.
		</ce-tab-panel>
		<ce-tab-panel name="charges">
			<ce-heading>Charges</ce-heading>
			<ce-divider style="--spacing:var(--ce-spacing-medium)"></ce-divider>
			This is the custom tab panel.
		</ce-tab-panel>
		<ce-tab-panel name="refunds">
			<ce-heading>Refunds</ce-heading>
			<ce-divider style="--spacing:var(--ce-spacing-medium)"></ce-divider>
			This is the custom tab panel.
		</ce-tab-panel>
		<ce-tab-panel name="payment-methods">
			<ce-heading>Payment Methods</ce-heading>
			<ce-divider style="--spacing:var(--ce-spacing-medium)"></ce-divider>
			This is the custom tab panel.
		</ce-tab-panel>
		<ce-tab-panel name="account">
			<ce-heading>Account Details</ce-heading>
			<ce-divider style="--spacing:var(--ce-spacing-medium)"></ce-divider>
			This is the custom tab panel.
		</ce-tab-panel>
  	</ce-tab-group>
</ce-customer-dashboard> --}}
