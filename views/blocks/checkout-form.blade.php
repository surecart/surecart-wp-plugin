<ce-checkout
	class="checkout"
	id="ce-checkout-{{ $instance }}"
	style="font-size: {{$font_size}}px"
    class="{{ $classes }}"
	alignment="{{$align}}"
	success_url="<?php echo esc_url($success_url);?>">
    <ce-form>
        <?php echo filter_block_content($content, 'post'); ?>
    </ce-form>
</ce-checkout>

<script>
	var checkout = document.querySelector(".checkout");
	checkout.choices = <?php echo wp_json_encode($choices); ?>;
	checkout.keys = {
		stripe: "pk_test_51FrVhTKIxBDlEhovnzFUjE1K3e8s9QInYW4a2S1BrYYgePmNIFZUCSvUY90MmD10PNh0ZxYFoxkW6P1xsfPofCYG00JTdSKWFO"
	};
</script>
