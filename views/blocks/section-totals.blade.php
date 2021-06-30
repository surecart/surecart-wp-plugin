@component('components.form-section', [
    'label' => $label ?? '',
    'description' => $description ?? '',
    ])
    <ce-order-summary></ce-order-summary>
    {{-- <ce-divider style="--spacing: 20px;"></ce-divider>
        <ce-line-item price="$20.00">
            Gold Plan
            <span slot="price">$20.00</span>
        </ce-line-item>
        <ce-divider style="--spacing: 20px;"></ce-divider>
        <ce-line-item price="$20.00"
            currency="USD">
            Total
        </ce-line-item> --}}
@endcomponent
