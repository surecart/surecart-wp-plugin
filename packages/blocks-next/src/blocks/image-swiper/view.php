<div
 class="image-slider"
 data-wp-interactive='{ "namespace": "surecart/image-slider" }'
 data-wp-context='{ "currentSliderIndex": 0 , "thumbnailsPerPage": 5}'
 data-wp-watch='surecart/image-slider::actions.onSliderChange'
 >
	<div class="swiper" data-wp-init="surecart/image-slider::actions.initImageSwiper">
		<div class="swiper-wrapper">
			<div  class="swiper-slide image-slider__slider">
			<div class="swiper-slide-img">
				<img src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80" />
			</div>
			</div>

			<div  class="swiper-slide image-slider__slider">
			<div class="swiper-slide-img">
				<img src="https://images.unsplash.com/photo-1598951092651-653c21f5d0b9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80" />
			</div>
			</div>

			<div  class="swiper-slide image-slider__slider">
			<div class="swiper-slide-img">
				<img src="https://images.unsplash.com/photo-1598946423291-ce029c687a42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80" />
			</div>
			</div>

		</div>
	</div>

	<div class="image-slider__thumbs">
		<button class="image-slider__navigation image-slider--is-prev">
			<sc-visually-hidden><?php echo __('Go to previous product slide.','surecart')?></sc-visually-hidden>
			<sc-icon name="chevron-left" aria-hidden="true" tab-index="0"  />
		</button>

		<div class="swiper" data-wp-init="surecart/image-slider::actions.initThumbsSwiper" >
			<div class="swiper-wrapper" role="radiogroup" aria-label="<?php esc_attr(sprintf(__('Products slide options section. There are %d options present.', 'surecart'), 4)) ?>">
				<button
					class="swiper-slide image-slider__thumb"
					role="radio"
					aria-checked="false"
					tabindex="0"
					thumb-index="0"
					data-wp-on--click="surecart/image-slider::actions.onThumbClick"
				>
					<img src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80" width="960" height="960" />
				</button>

				<button
					class="swiper-slide image-slider__thumb"
					role="radio"
					aria-checked="false"
					tabindex="0"
					data-wp-on--click="surecart/image-slider::actions.onThumbClick"
					thumb-index="1"
				>
					<img src="https://images.unsplash.com/photo-1598951092651-653c21f5d0b9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80" width="960" height="960" />
				</button>

				<button
					data-wp-on--click="surecart/image-slider::actions.onThumbClick"
					class="swiper-slide image-slider__thumb"
					role="radio"
					aria-checked="false"
					tabindex="0"
					thumb-index="2"
				>
					<img src="https://images.unsplash.com/photo-1598946423291-ce029c687a42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80" width="960" height="960" />
				</button>
			</div>
		</div>

		<button class="image-slider__navigation image-slider--is-next">
			<sc-visually-hidden><?php echo __('Go to next product slide.','surecart')?></sc-visually-hidden>
			<sc-icon name="chevron-right" aria-hidden="true" tab-index="0" />
		</button>
	</div>
</div>
