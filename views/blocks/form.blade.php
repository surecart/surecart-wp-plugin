<ce-checkout
    class="checkout"
    id="{{ $id }}"
    form-id="{{ $form_id }}"
    style="font-size: {{ $font_size }}px"
    class="{{ $classes }}"
    mode="{{ $mode }}"
    alignment="{{ $align }}"
    choice-type="{{ $choice_type }}"
    success-url="<?php echo esc_url($success_url); ?>"
>
    <ce-form>
        <?php echo filter_block_content($content, 'post'); ?>
    </ce-form>
</ce-checkout>


@php
// This dynamically adds prop data to a component since we cannot pass objects data as a prop.
\CheckoutEngine::assets()->addComponentData('ce-checkout', '#' . $id, [
    'prices' => $prices,
    'i18n' => $i18n,
    'customer' => $customer,
]);
@endphp
