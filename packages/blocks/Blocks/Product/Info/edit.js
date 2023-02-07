/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	useSetting,
} from '@wordpress/block-editor';
import {
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalUnitControl as UnitControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	ToggleControl,
} from '@wordpress/components';

import { getQueryArg } from '@wordpress/url';
import { ScProduct } from '@surecart/components-react';
import { PanelBody, PanelRow } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { column_gap, media_width, media_position, sticky_content } =
		attributes;

	const units = useCustomUnits({
		availableUnits: useSetting('spacing.units') || [
			'%',
			'px',
			'em',
			'rem',
			'vw',
		],
	});

	const blockProps = useBlockProps({
		mediaPosition: media_position,
		mediaWidth: media_width,
		columnGap: column_gap,
		stickyContent: sticky_content,
	});
	const innerBlocksProps = useInnerBlocksProps(blockProps);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Media', 'surecart')}>
					<ToggleGroupControl
						label={__('Desktop Media Position', 'surecart')}
						value={media_position}
						onChange={(media_position) =>
							setAttributes({ media_position })
						}
						isBlock
					>
						<ToggleGroupControlOption
							value="left"
							label={__('Left', 'surecart')}
						/>
						<ToggleGroupControlOption
							value="right"
							label={__('Right', 'surecart')}
						/>
					</ToggleGroupControl>

					<PanelRow>
						<UnitControl
							label={__('Media Width', 'surecart')}
							labelPosition="edge"
							__unstableInputWidth="80px"
							value={media_width || ''}
							onChange={(nextWidth) => {
								setAttributes({
									media_width:
										0 > parseFloat(nextWidth)
											? '0'
											: nextWidth,
								});
							}}
							units={units}
						/>
					</PanelRow>
					<PanelRow>
						<UnitControl
							label={__('Column Gap', 'surecart')}
							labelPosition="edge"
							__unstableInputWidth="80px"
							value={column_gap}
							onChange={(column_gap) =>
								setAttributes({ column_gap })
							}
							units={units}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title={__('Content', 'surecart')}>
					<ToggleControl
						label={__('Sticky Content', 'surecart')}
						help={__(
							'Enable sticky content on desktop.',
							'surecart'
						)}
						checked={sticky_content}
						onChange={(sticky_content) =>
							setAttributes({ sticky_content })
						}
					/>
				</PanelBody>
			</InspectorControls>

			<ScProduct {...innerBlocksProps} />
		</>
	);
};
