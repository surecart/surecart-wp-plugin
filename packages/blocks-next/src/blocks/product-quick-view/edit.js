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
	PanelBody,
	PanelRow,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useViewportMatch } from '@wordpress/compose';

export default ({ attributes, setAttributes }) => {
	const { alignment } = attributes;
	const blockProps = useBlockProps({
		className: `position-${alignment.replace(' ', '-')}`,
	});
	const innerBlocksProps = useInnerBlocksProps(blockProps);
	const isMobile = useViewportMatch('medium', '<');

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={__('Popup', 'surecart')}
					resetAll={() =>
						setAttributes({ alignment: 'bottom right' })
					}
					dropdownMenuProps={
						isMobile
							? {}
							: {
									popoverProps: {
										placement: 'left-start',
										// For non-mobile, inner sidebar width (248px) - button width (24px) - border (1px) + padding (16px) + spacing (20px)
										offset: 259,
									},
							  }
					}
				>
					<ToolsPanelItem
						hasValue={() => !!alignment}
						label={__('Alignment', 'surecart')}
						onDeselect={() =>
							setAttributes({ alignment: 'bottom right' })
						}
					>
						<AlignmentMatrixControl
							value={alignment}
							onChange={(alignment) => {
								setAttributes({ alignment });
							}}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<div {...innerBlocksProps}></div>;
		</>
	);
};
