<ce-checkout id="ce-checkout-{{ $instance }}"
    stripe-publishable-key="
 pk_test_51FrVhTKIxBDlEhovnzFUjE1K3e8s9QInYW4a2S1BrYYgePmNIFZUCSvUY90MmD10PNh0ZxYFoxkW6P1xsfPofCYG00JTdSKWFO">
    <ce-form>
        <?php echo filter_block_content($content, 'post'); ?>
    </ce-form>
</ce-checkout>
<script>
    var checkout = document.querySelector(
        "ce-checkout#ce-checkout-{{ $instance }}");
    checkout.priceIds = <?php echo wp_json_encode($price_ids); ?>;
</script>
