@component('components.form-section', [
    'label' => $label ?? '',
    ])

    @if (!empty($description))
        <ce-secure-notice slot="description">
            <?php echo wp_kses_post($description); ?>
        </ce-secure-notice>
    @endif

    <ce-payment stripe-account-id="<?php echo esc_attr(\CheckoutEngine\Models\Account::getStripeAccountId()); ?>"
        stripe-publishable-key="pk_test_51FrVhTKIxBDlEhovnzFUjE1K3e8s9QInYW4a2S1BrYYgePmNIFZUCSvUY90MmD10PNh0ZxYFoxkW6P1xsfPofCYG00JTdSKWFO">
    </ce-payment>

@endcomponent
