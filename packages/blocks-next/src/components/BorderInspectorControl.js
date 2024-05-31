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
	const SingleColumnItem = styled.div`
		grid-column: 1 / -1;

		.components-base-control {
			margin-bottom: 0 !important;
		}
	`;
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	return (
		<InspectorControls group="border">
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
		</InspectorControls>
	);
};
