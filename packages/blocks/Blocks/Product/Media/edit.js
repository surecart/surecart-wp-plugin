import { ScImageSlider } from '@surecart/components-react';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Disabled } from '@wordpress/components';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default ({ attributes, setAttributes, isSelected }) => {
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
					<ScImageSlider
						key={renderKey}
						images={JSON.stringify(images)}
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
