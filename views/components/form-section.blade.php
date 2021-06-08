<ce-form-section>
	@isset($label)
	<span slot="label"><?php echo wp_kses_post($label); ?></span>
	@endisset

	@isset($description)
	<span slot="description"><?php echo wp_kses_post($description); ?></span>
	@endisset

	{{ $slot }}
</ce-form-section>
