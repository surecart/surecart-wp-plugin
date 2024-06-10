import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import Swiper from 'swiper';
import { Thumbs, Navigation } from 'swiper/modules';
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

export default ({ attributes, setAttributes, isSelected }) => {
	const swiperRef = useRef(null);
	const thumbSwiperRef = useRef(null);
	const swiper = useRef(null);

	const { height, show_thumbnails, thumbnails_per_page, auto_height, width } =
		attributes;
	const [images, setImages] = useState([]);
	const [renderKey, setRenderKey] = useState(0);
	const blockProps = useBlockProps({});

	const units = useCustomUnits({
		availableUnits: ['px', 'em', 'rem', 'vh'],
	});

	useEffect(() => {
		setRenderKey(renderKey + 1);
	}, [show_thumbnails, thumbnails_per_page, images, height, auto_height]);

	useEffect(() => {
		setImages(
			[...Array(thumbnails_per_page + 1)].map(() => {
				return {
					src: scBlockData?.plugin_url + '/images/placeholder.jpg',
					width: width,
				};
			})
		);
	}, [width, thumbnails_per_page]);

	useEffect(() => {
		if (swiperRef && thumbSwiperRef) {
			const thumbsSwiper = new Swiper(
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
					swiper: thumbsSwiper,
				},
			});
		}
	}, []);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<ToggleControl
						label={__('Auto Height', 'surecart')}
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
						max={20}
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
				<Disabled isDisabled={!isSelected}>
					<div className="sc-image-slider">
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
												swiper?.current?.slideTo(index)
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
					</div>
				</Disabled>
			</div>
		</>
	);
};
