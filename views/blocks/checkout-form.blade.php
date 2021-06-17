<ce-checkout id="ce-checkout-{{ $instance }}"
    stripe-publishable-key="
        pk_test_51IGqEQFOGhs5FBqkukQRgXOUWl4zEUF8t9NAEz9QdTozrZ9QlWNXbKROsKICnpY808sEfhZYLfSAeSX3arrT8A6K00gf5F5845">
    <ce-form>
        <?php echo filter_block_content($content, 'post'); ?>
    </ce-form>
</ce-checkout>
<script>
    var checkout = document.querySelector(
        "ce-checkout#ce-checkout-{{ $instance }}");
    checkout.priceIds = <?php echo wp_json_encode($price_ids); ?>;
</script>
