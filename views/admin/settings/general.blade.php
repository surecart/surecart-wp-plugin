<div class="wrap">
    <h1 class="wp-heading-inline">{{ __('Settings', 'checkout_engine') }}</h1>

    @component('admin.components.settings-menu', [
        'tab' => $tab ?? '',
        ])
    @endcomponent

    General
</div>
