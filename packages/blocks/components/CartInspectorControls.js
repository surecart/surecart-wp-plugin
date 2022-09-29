/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelColorSettings } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	__experimentalBoxControl as BoxControl,
} from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { backgroundColor, textColor, padding, border } = attributes;
	return (
		<>
			<PanelColorSettings
				title={__('Color Settings')}
				colorSettings={[
					{
						value: backgroundColor,
						onChange: (backgroundColor) =>
							setAttributes({ backgroundColor }),
						label: __('Background Color', 'surecart'),
					},
					{
						value: textColor,
						onChange: (textColor) => setAttributes({ textColor }),
						label: __('Text Color', 'surecart'),
					},
				]}
			></PanelColorSettings>
			<PanelBody title={__('Spacing', 'surecart')}>
				<BoxControl
					label={__('Padding', 'surecart')}
					values={padding}
					resetValues={{
						top: '1.25em',
						right: '1.25em',
						bottom: '1.25em',
						left: '1.25em',
					}}
					onChange={(padding) => setAttributes({ padding })}
				/>
			</PanelBody>
			<PanelBody title={__('Border', 'surecart')}>
				<PanelRow>
					<ToggleControl
						label={__('Bottom Border', 'surecart')}
						checked={border}
						onChange={(border) => setAttributes({ border })}
					/>
				</PanelRow>
			</PanelBody>
		</>
	);
};
