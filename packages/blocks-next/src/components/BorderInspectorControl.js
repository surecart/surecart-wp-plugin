import { __ } from '@wordpress/i18n';
import styled from '@emotion/styled';
import { __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import {
	__experimentalBorderBoxControl as BorderBoxControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

export default (props) => {
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const SingleColumnItem = styled.div`
		grid-column: 1 / -1;

		.components-base-control {
			margin-bottom: 0 !important;
		}
	`;

	return (
		<InspectorControls group="styles">
			<ToolsPanel label={__('Dimensions')} resetAll={() => {}}>
				<ToolsPanelItem
					hasValue={() => false}
					label={__('Padding')}
					onDeselect={() => {}}
				></ToolsPanelItem>
				<ToolsPanelItem
					hasValue={() => false}
					label={__('Margin')}
					onDeselect={() => {}}
				></ToolsPanelItem>
				<ToolsPanelItem
					hasValue={() => false}
					label={__('Item Padding')}
					onDeselect={() => {}}
				></ToolsPanelItem>
				<ToolsPanelItem
					hasValue={() => false}
					label={__('Item Margin')}
					onDeselect={() => {}}
				></ToolsPanelItem>
				<SingleColumnItem>
					<BorderBoxControl
						__experimentalIsRenderedInSidebar={true}
						popoverOffset={40}
						popoverPlacement="left-start"
						enableAlpha={true}
						size={'__unstable-large'}
						{...colorGradientSettings}
						{...props}
					/>
				</SingleColumnItem>
			</ToolsPanel>
		</InspectorControls>
	);
};
