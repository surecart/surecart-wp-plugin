import { ScImageSlider } from '@surecart/components-react';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Disabled } from '@wordpress/components';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

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

export default ({ attributes, setAttributes, isSelected }) => {
	const { height, images, show_thumbnails, thumbnails_per_page } = attributes;
	const [renderKey, setRenderKey] = useState(0);
	const blockProps = useBlockProps({
		images: images?.length ? images : imagesArr,
		thumbnails: show_thumbnails,
		thumbnailsPerPage: thumbnails_per_page,
		style: { '--sc-product-slider-height': height },
	});

	const units = useCustomUnits({
		availableUnits: ['px', 'em', 'rem', 'vh'],
	});

	useEffect(() => {
		setRenderKey(renderKey + 1);
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

			<div {...blockProps}>
				<Disabled isDisabled={!isSelected}>
					<ScImageSlider
						key={renderKey}
						images={imagesArr}
						thumbnails={show_thumbnails}
						thumbnailsPerPage={thumbnails_per_page}
						style={{ '--sc-product-slider-height': height }}
					/>
				</Disabled>
			</div>
		</Fragment>
	);
};
