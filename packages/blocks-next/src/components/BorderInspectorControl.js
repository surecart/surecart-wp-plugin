import { __ } from '@wordpress/i18n';
import { __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import {
	BorderBoxControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalToolsPanel as ToolsPanel,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

const singleColumnItemStyle = {
	gridColumn: '1 / -1',
};

export default (props) => {
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	return (
		<InspectorControls group="border">
			<div style={singleColumnItemStyle} className="sc-single-column-item">
				<BorderBoxControl
					__experimentalIsRenderedInSidebar={true}
					popoverOffset={40}
					popoverPlacement="left-start"
					enableAlpha={true}
					size={'__unstable-large'}
					{...colorGradientSettings}
					{...props}
				/>
			</div>
		</InspectorControls>
	);
};
