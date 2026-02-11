import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useEntityRecord } from '@wordpress/core-data';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Disabled } from '@wordpress/components';

// Get placeholder URL with fallback.
const getPlaceholderUrl = () => {
	const pluginUrl =
		window.scBlockData?.plugin_url || window.scData?.plugin_url || '';
	return pluginUrl
		? `${pluginUrl}/images/placeholder.jpg`
		: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Cpath fill="%23ccc" d="M200 150c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30z"/%3E%3Cpath fill="%23ccc" d="M320 100H80c-11 0-20 9-20 20v160c0 11 9 20 20 20h240c11 0 20-9 20-20V120c0-11-9-20-20-20zm0 180H80V120h240v160z"/%3E%3C/svg%3E';
};

export default ({ attributes, setAttributes, context: { postId } = {} }) => {
	const {
		height,
		thumbnails_per_page,
		auto_height,
		width,
		lightbox,
		desktop_gallery,
		show_thumbnails,
	} = attributes;
	const blockProps = useBlockProps({});

	const { record } = useEntityRecord('postType', 'sc_product', postId, {
		enabled: !!postId,
	});

	const product = record?.meta?.product;

	const units = useCustomUnits({
		availableUnits: ['px', 'em', 'rem', 'vh'],
	});

	// Use useMemo to avoid flicker while gallery set.
	const images = useMemo(() => {
		const placeholderUrl = getPlaceholderUrl();
		if (product?.gallery?.length) {
			return product.gallery.map((image) => ({
				src: image?.url,
				width,
			}));
		}
		return [...Array(desktop_gallery ? 3 : 5)].map(() => ({
			src: placeholderUrl,
			width,
		}));
	}, [width, thumbnails_per_page, product, desktop_gallery]);

	const autoHeightEnabled = desktop_gallery ? true : auto_height;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<ToggleControl
						__nextHasNoMarginBottom
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

					{!desktop_gallery && (
						<ToggleControl
							__nextHasNoMarginBottom
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
					)}

					{!desktop_gallery && !auto_height && (
						<UnitControl
							__next40pxDefaultSize
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
						onChange={(width) => setAttributes({ width: width })}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={__('Show Thumbnails', 'surecart')}
						help={__(
							'Show thumbnails for the image slider.',
							'surecart'
						)}
						checked={show_thumbnails}
						onChange={(show_thumbnails) =>
							setAttributes({
								show_thumbnails,
							})
						}
					/>
					{!desktop_gallery && show_thumbnails && (
						<RangeControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
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
					)}
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
						<div className="swiper swiper-initialized">
							<div className="swiper-wrapper">
								{images.map((image, index) => (
									<div className="swiper-slide" key={index}>
										<img
											src={image.src}
											alt=""
											width={image.width}
											style={{
												height: autoHeightEnabled
													? 'auto'
													: height,
											}}
										/>
									</div>
								))}
							</div>

							<div className="swiper-button-prev"></div>
							<div className="swiper-button-next"></div>
						</div>

						{images?.length > 1 && show_thumbnails ? (
							<div
								className="sc-image-slider__thumbs"
								style={{ opacity: 1, visibility: 'visible' }}
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
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<polyline points="15 18 9 12 15 6" />
									</svg>
								</div>

								<div className="swiper swiper-initialized">
									<div
										className={`swiper-wrapper sc-has-${thumbnails_per_page}-thumbs`}
									>
										{images.map((image, index) => (
											<div
												className="swiper-slide"
												key={index}
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
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
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
