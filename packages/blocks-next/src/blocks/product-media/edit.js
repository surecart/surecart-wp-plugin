import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import Swiper from 'swiper';
import { Thumbs, Navigation } from 'swiper/modules';
import { useEntityRecord } from '@wordpress/core-data';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Disabled } from '@wordpress/components';

export default ({ attributes, setAttributes, context: { postId } }) => {
	const swiperRef = useRef(null);
	const thumbSwiperRef = useRef(null);
	const swiper = useRef(null);
	const thumbSwiper = useRef(null);

	const {
		height,
		show_thumbnails,
		thumbnails_per_page,
		auto_height,
		width,
		lightbox,
		desktop_gallery,
	} = attributes;
	const [images, setImages] = useState([]);
	const blockProps = useBlockProps({});

	const { record: { meta: { product } = {} } = {} } = useEntityRecord(
		'postType',
		'sc_product',
		postId
	);

	const units = useCustomUnits({
		availableUnits: ['px', 'em', 'rem', 'vh'],
	});

	useEffect(() => {
		setImages(
			product?.gallery
				? product?.gallery.map((image) => {
						return {
							src: image?.url,
							width,
						};
				  })
				: [...Array(desktop_gallery ? 3 : 20)].map(() => {
						return {
							src:
								scBlockData?.plugin_url +
								'/images/placeholder.jpg',
							width,
						};
				  })
		);
	}, [width, thumbnails_per_page, product, desktop_gallery]);

	// update the slider when the props change.
	useEffect(() => {
		if (!swiper.current) {
			return;
		}
		swiper.current.update();
	}, [height, auto_height, width, images]);

	useEffect(() => {
		if (!thumbSwiper.current) {
			return;
		}
		thumbSwiper.current.update();
	}, [show_thumbnails, thumbnails_per_page, images]);

	useEffect(() => {
		if (swiperRef && thumbSwiperRef?.current) {
			thumbSwiper.current = new Swiper(
				thumbSwiperRef.current.querySelector('.swiper'),
				{
					modules: [Navigation],
					direction: 'horizontal',
					navigation: {
						nextEl: thumbSwiperRef.current.querySelector(
							'.sc-image-slider-button__next'
						),
						prevEl: thumbSwiperRef.current.querySelector(
							'.sc-image-slider-button__prev'
						),
					},
					loop: false,
					centerInsufficientSlides: true,
					slideToClickedSlide: true,
					watchSlidesProgress: true,
					slidesPerView: 3,
					slidesPerGroup: 3,
					spaceBetween: 10,
					breakpointsBase: 'container',
					breakpoints: {
						320: {
							slidesPerView: 5,
							slidesPerGroup: 5,
						},
					},
				}
			);

			swiper.current = new Swiper(swiperRef.current, {
				modules: [Navigation, Thumbs],
				direction: 'horizontal',
				loop: false,
				centeredSlides: true,
				autoHeight: auto_height,
				navigation: {
					nextEl: swiperRef.current.querySelector(
						'.swiper-button-next'
					),
					prevEl: swiperRef.current.querySelector(
						'.swiper-button-prev'
					),
				},
				thumbs: {
					swiper: thumbSwiper.current,
				},
			});
		}
	}, []);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<ToggleControl
						label={__('Enlarge on click', 'surecart')}
						help={__(
							'Scale images with a lightbox effect.',
							'surecart'
						)}
						checked={lightbox}
						onChange={(lightbox) =>
							setAttributes({
								lightbox,
							})
						}
					/>

					<ToggleControl
						label={__('Auto Height', 'surecart')}
						help={__(
							'Automatically adjust the height of the slider to the image height.',
							'surecart'
						)}
						checked={auto_height}
						onChange={(auto_height) =>
							setAttributes({
								auto_height,
							})
						}
					/>

					{!auto_height && (
						<UnitControl
							label={__('Slider Height', 'surecart')}
							labelPosition="edge"
							__unstableInputWidth="100px"
							value={height}
							onChange={(height) => setAttributes({ height })}
							units={units}
						/>
					)}

					<NumberControl
						label={__('Max Image Width', 'surecart')}
						placeholder={__('Unlimited', 'surecart')}
						value={width}
						min={1}
						spinControls={'custom'}
						onChange={(width) =>
							setAttributes({ width: parseInt(width) })
						}
					/>

					<RangeControl
						label={__('Thumbnails Per Page', 'surecart')}
						min={2}
						max={12}
						value={thumbnails_per_page}
						onChange={(thumbnails_per_page) =>
							setAttributes({
								thumbnails_per_page,
							})
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<Disabled>
					<div
						className={
							desktop_gallery
								? 'sc-image-gallery'
								: 'sc-image-slider'
						}
					>
						<div className="swiper" ref={swiperRef}>
							<div className="swiper-wrapper">
								{images.map((image, index) => (
									<div className="swiper-slide" key={index}>
										<img
											src={image.src}
											alt=""
											width={image.width}
											style={{
												height: auto_height
													? 'auto'
													: height,
											}}
										/>
									</div>
								))}
							</div>

							<div class="swiper-button-prev"></div>
							<div class="swiper-button-next"></div>
						</div>

						{images?.length > 1 ? (
							<div
								className="sc-image-slider__thumbs"
								ref={thumbSwiperRef}
							>
								<div
									className="sc-image-slider-button__prev"
									tabIndex="-1"
									role="button"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<polyline points="15 18 9 12 15 6" />
									</svg>
								</div>

								<div className="swiper">
									<div
										className={`swiper-wrapper  sc-has-${thumbnails_per_page}-thumbs`}
									>
										{images.map((image, index) => (
											<div
												className="swiper-slide"
												key={index}
												onClick={() =>
													swiper?.current?.slideTo(
														index
													)
												}
											>
												<img src={image.src} alt="" />
											</div>
										))}
									</div>
								</div>

								<div
									className="sc-image-slider-button__next"
									tabIndex="-1"
									role="button"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<polyline points="9 18 15 12 9 6" />
									</svg>
								</div>
							</div>
						) : null}
					</div>
				</Disabled>
			</div>
		</>
	);
};
