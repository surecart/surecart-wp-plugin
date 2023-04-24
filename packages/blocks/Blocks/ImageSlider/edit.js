import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { Fragment, useEffect, useState } from '@wordpress/element';
import {
	PanelBody,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';
import { ScImageSlider } from '@surecart/components-react';

const imagesArr = [
	{
		src: 'https://unsplash.com/photos/PDX_a_82obo/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgyMzMwMTk4&force=true&w=640',
		alt: '',
	},
	{
		src: 'https://unsplash.com/photos/PvIz8BmuwDw/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjgyMzMwMjg4&force=true&w=640',
		alt: '',
	},
	{
		src: 'https://unsplash.com/photos/oBI4NBP2Lhg/download?force=true&w=640',
		alt: '',
	},
	{
		src: 'https://unsplash.com/photos/GI6L2pkiZgQ/download?force=true&w=640',
		alt: '',
	},
	{
		src: 'https://unsplash.com/photos/cZWZjymwI9o/download?force=true&w=640',
		alt: '',
	},
];

let timerId;

export default ({ attributes, setAttributes }) => {
	const { height, images, show_thumbnails, thumbnails_per_page } = attributes;
	const [propChanging, setPropChanging] = useState(false);

	const units = useCustomUnits({
		availableUnits: ['px', 'em', 'rem', 'vh'],
	});

	useEffect(() => {
		setPropChanging(true);
		clearTimeout(timerId);

		timerId = setTimeout(() => {
			setPropChanging(false);
		}, 100);

		() => {
			clearTimeout(timerId);
		};
	}, [height, show_thumbnails, thumbnails_per_page]);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<UnitControl
						label={__('Slider Height', 'surecart')}
						labelPosition="edge"
						__unstableInputWidth="100px"
						value={height}
						onChange={(height) => {
							height = 0 > parseFloat(height) ? '0' : height;
							setAttributes({ height });
						}}
						units={units}
					/>
					<ToggleControl
						label={__('Show Slider Thumbnails', 'surecart')}
						checked={show_thumbnails}
						onChange={(isChecked) =>
							setAttributes({
								show_thumbnails: isChecked,
							})
						}
					/>
					{show_thumbnails && (
						<RangeControl
							label={__('Thumbnails Per Page', 'surecart')}
							min={1}
							max={20}
							value={thumbnails_per_page}
							onChange={(perPage) =>
								setAttributes({
									thumbnails_per_page: parseInt(perPage, 10),
								})
							}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div style={{ padding: '1rem' }}>
				{propChanging ? (
					<p>Loading...</p>
				) : (
					<ScImageSlider
						images={images?.length ? images : imagesArr}
						thumbnails={show_thumbnails}
						thumbnailsPerPage={thumbnails_per_page}
						style={{ '--sc-product-slider-height': height }}
					/>
				)}
			</div>
		</Fragment>
	);
};
