/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { firstnameLabel, lastnameLabel, firstnameHelp, lastnameHelp } =
		attributes;

	return (
		<InspectorControls>
			<PanelBody title={__('Attributes', 'surecart')}>
				<PanelRow>
					<TextControl
						label={__('First Name Label', 'surecart')}
						value={firstnameLabel}
						onChange={(firstnameLabel) =>
							setAttributes({ firstnameLabel })
						}
					/>
				</PanelRow>
				<PanelRow>
					<TextControl
						label={__('First Name Help', 'surecart')}
						value={firstnameHelp}
						onChange={(firstnameHelp) =>
							setAttributes({ firstnameHelp })
						}
					/>
				</PanelRow>
				<PanelRow>
					<TextControl
						label={__('Last Name Label', 'surecart')}
						value={lastnameLabel}
						onChange={(lastnameLabel) =>
							setAttributes({ lastnameLabel })
						}
					/>
				</PanelRow>
				<PanelRow>
					<TextControl
						label={__('First Name Help', 'surecart')}
						value={lastnameHelp}
						onChange={(lastnameHelp) =>
							setAttributes({ lastnameHelp })
						}
					/>
				</PanelRow>
			</PanelBody>
		</InspectorControls>
	);
};
