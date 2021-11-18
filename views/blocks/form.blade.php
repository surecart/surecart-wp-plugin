<ce-checkout
	class="checkout"
	id="{{ $id }}"
	style="font-size: {{$font_size}}px"
    class="{{ $classes }}"
	alignment="{{$align}}"
	choice-type="{{$choice_type}}"
	success-url="<?php echo esc_url($success_url);?>">
    <ce-form>
        <?php echo filter_block_content($content, 'post'); ?>
    </ce-form>
</ce-checkout>

<script>
	var checkout = document.querySelector(".checkout");
	checkout.prices = <?php echo wp_json_encode($prices); ?>;
	checkout.i18n = <?php echo wp_json_encode($i18n); ?>;
	checkout.keys = {
		stripe: "pk_test_51FrVhTKIxBDlEhovnzFUjE1K3e8s9QInYW4a2S1BrYYgePmNIFZUCSvUY90MmD10PNh0ZxYFoxkW6P1xsfPofCYG00JTdSKWFO",
		stripeAccountId: 'acct_1J8pDC2ejo5ZGM5Q'
	};
</script>
