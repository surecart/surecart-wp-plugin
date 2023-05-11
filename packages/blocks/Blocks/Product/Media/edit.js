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
import { useEffect, useState, useRef } from '@wordpress/element';
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
	const { height, show_thumbnails, thumbnails_per_page, auto_height } =
		attributes;
	const [renderKey, setRenderKey] = useState(0);
	const blockProps = useBlockProps({});

	const units = useCustomUnits({
		availableUnits: ['px', 'em', 'rem', 'vh'],
	});

	useEffect(() => {
		setRenderKey(renderKey + 1);
	}, [show_thumbnails, thumbnails_per_page, imagesArr, height, auto_height]);

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
					<sc-image-slider
						key={renderKey}
						images={JSON.stringify(imagesArr)}
						has-thumbnails
						thumbnails-per-page={thumbnails_per_page}
						autoHeight={auto_height}
						style={{
							'--sc-product-slider-height': auto_height
								? 'auto'
								: height,
						}}
					/>
				</Disabled>
			</div>
		</>
	);
};
