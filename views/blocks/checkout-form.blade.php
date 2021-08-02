<ce-checkout id="ce-checkout-{{ $instance }}"
    class="{{ $classes }}">
    <ce-form>
        <?php echo filter_block_content($content, 'post'); ?>
    </ce-form>
</ce-checkout>
