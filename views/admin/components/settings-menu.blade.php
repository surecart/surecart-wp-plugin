<?php $tab = !empty($tab) ? $tab : null; ?>

<nav class="nav-tab-wrapper">
    <a href="?page=ce-settings"
        class="nav-tab {{ !$tab ? 'nav-tab-active' : '' }}">{{ __('General', 'checkout_engine') }}</a>
    <a href="?page=ce-settings&tab=payment-gateways"
        class="nav-tab {{ 'settings' === $tab ? 'nav-tab-active' : '' }}">Settings</a>
    <a href="?page=ce-settings&tab=account"
        class="nav-tab {{ 'account' === $tab ? 'nav-tab-active' : '' }}">Account</a>
</nav>
