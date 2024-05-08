<div class="sc-quantity-selector">
	<button class="sc-quantity-selector__decrease">
		<?php echo wp_kses( SureCart::svg()->get( 'minus' ), sc_allowed_svg_html() ); ?>
	</button>
	<input class="sc-quantity-selector__control" />
	<button class="sc-quantity-selector__increase">
		<?php echo wp_kses( SureCart::svg()->get( 'plus' ), sc_allowed_svg_html() ); ?>
	</button>
</div>
