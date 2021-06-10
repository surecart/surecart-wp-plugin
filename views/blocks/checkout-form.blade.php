<ce-checkout id="ce-checkout-{{ $instance }}"
    publishable-key="
        pk_test_51IGqEQFOGhs5FBqkukQRgXOUWl4zEUF8t9NAEz9QdTozrZ9QlWNXbKROsKICnpY808sEfhZYLfSAeSX3arrT8A6K00gf5F5845">
    <ce-form>
        <?php echo filter_block_content($content, 'post'); ?>
    </ce-form>
</ce-checkout>
<script>
    var checkout = document.querySelector(
        "ce-checkout#ce-checkout-{{ $instance }}");
    checkout.priceIds = <?php echo wp_json_encode(['dd514523-297b-4a86-b5ff-6db0a70d7e16',
        'dd514523-297b-4a86-b5ff-6db0a70d7e17', '85109619-529d-47b3-98c3-ca90d22913e4'
    ]); ?>;
</script>
