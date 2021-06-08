@component('components.form-section', [
'label' => $label ?? '',
'description' => $description ?? '',
])

<?php echo filter_block_content($content); ?>

@endcomponent
