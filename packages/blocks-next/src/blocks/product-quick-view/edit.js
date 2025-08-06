/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	AlignmentMatrixControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalUnitControl as UnitControl,
	BaseControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useToolsPanelDropdownMenuProps } from '../utils';

export default ({ attributes, setAttributes }) => {
	const { alignment, width, height } = attributes;
	const blockProps = useBlockProps({
		className: alignment ? `position-${alignment.replace(' ', '-')}` : '',
		style: {
			maxWidth: width || '',
			height: height || '',
		},
	});
	const innerBlocksProps = useInnerBlocksProps(blockProps);
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={__('Size', 'surecart')}
					resetAll={() =>
						setAttributes({
							width: null,
							height: null,
						})
					}
					dropdownMenuProps={dropdownMenuProps}
				>
					<ToolsPanelItem
						hasValue={() => !!width}
						label={__('Width', 'surecart')}
						onDeselect={() => setAttributes({ width: null })}
					>
						<UnitControl
							label={__('Width', 'surecart')}
							value={width}
							placeholder={__('500', 'surecart')}
							onChange={(width) => setAttributes({ width })}
						/>
					</ToolsPanelItem>
					<ToolsPanelItem
						hasValue={() => !!height}
						label={__('Height', 'surecart')}
						onDeselect={() => setAttributes({ height: null })}
					>
						<UnitControl
							label={__('Height', 'surecart')}
							value={height}
							placeholder={__('500', 'surecart')}
							onChange={(height) => setAttributes({ height })}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
				<ToolsPanel
					label={__('Position', 'surecart')}
					resetAll={() =>
						setAttributes({
							alignment: undefined,
						})
					}
					dropdownMenuProps={dropdownMenuProps}
				>
					<ToolsPanelItem
						hasValue={() => !!alignment}
						label={__('Position', 'surecart')}
						onDeselect={() =>
							setAttributes({ alignment: undefined })
						}
						isShownByDefault
					>
						<BaseControl
							__nextHasNoMarginBottom
							label={__('Position', 'surecart')}
						>
							<AlignmentMatrixControl
								value={alignment}
								onChange={(alignment) => {
									setAttributes({ alignment });
								}}
							/>
						</BaseControl>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<div {...innerBlocksProps}></div>;
		</>
	);
};
