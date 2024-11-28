import { __ } from '@wordpress/i18n';
import { __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import { __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown } from '@wordpress/block-editor';
import { InspectorControls } from '@wordpress/block-editor';

export default (props) => {
	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	return (
		<InspectorControls group="color">
			<ColorGradientSettingsDropdown
				__experimentalIsRenderedInSidebar
				{...colorGradientSettings}
				gradients={[]}
				disableCustomGradients={true}
				{...props}
			/>
		</InspectorControls>
	);
};
