<ce-form-section label="{{$label}}">
	@isset($records)
	<span slot="description"><?php echo wp_kses_post( $attributes['description'] ); ?></span>
	@endisset

	{{ $slot }}
</ce-form-section>
