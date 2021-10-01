<ce-payment
	stripe-account-id="<?php echo esc_attr(\CheckoutEngine\Models\Account::getStripeAccountId()); ?>"
	secure-notice="<?php echo  $description ? esc_attr($description) : ''?>"
	stripe-publishable-key="pk_test_51FrVhTKIxBDlEhovnzFUjE1K3e8s9QInYW4a2S1BrYYgePmNIFZUCSvUY90MmD10PNh0ZxYFoxkW6P1xsfPofCYG00JTdSKWFO">
</ce-payment>
