<ce-choices>

@foreach ($prices as $price)
	<ce-choice name="{{$price['name']}}"
		@if (!empty($price['required'])) required @endif
		@if (!empty($price['default'])) checked @endif>

		@isset($price['title'])
		<?php echo wp_kses_post($price['title']); ?>
		@endisset

		@isset($price['description'])
		<span slot="description"><?php echo wp_kses_post($price['description']); ?></span>
		@endisset
	</ce-choice>
@endforeach

</ce-choices>
