/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { ScInput, ScOrderPassword } from '@surecart/components-react';

export default ({ className, attributes, setAttributes, isSelected }) => {
	const {
		label,
		placeholder,
		help,
		required,
		confirmation,
		confirmation_label,
		confirmation_placeholder,
		confirmation_help,
	} = attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__('Required', 'surecart')}
							checked={required}
							onChange={(required) => setAttributes({ required })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Placeholder', 'surecart')}
							value={placeholder}
							onChange={(placeholder) =>
								setAttributes({ placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Help', 'surecart')}
							value={help}
							onChange={(help) => setAttributes({ help })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Password Confirmation', 'surecart')}
							checked={confirmation}
							onChange={(confirmation) =>
								setAttributes({ confirmation })
							}
						/>
					</PanelRow>
					{confirmation && (
						<>
							<PanelRow>
								<TextControl
									label={__(
										'Password Confirmation Label',
										'surecart'
									)}
									value={confirmation_label}
									onChange={(confirmation_label) =>
										setAttributes({ confirmation_label })
									}
								/>
							</PanelRow>
							<PanelRow>
								<TextControl
									label={__(
										'Password Confirmation Placeholder',
										'surecart'
									)}
									value={confirmation_placeholder}
									onChange={(confirmation_placeholder) =>
										setAttributes({
											confirmation_placeholder,
										})
									}
								/>
							</PanelRow>
							<PanelRow>
								<TextControl
									label={__(
										'Password Confirmation Help',
										'surecart'
									)}
									value={confirmation_help}
									onChange={(confirmation_help) =>
										setAttributes({ confirmation_help })
									}
								/>
							</PanelRow>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			<ScOrderPassword
				className={className}
				name={'password'}
				label={label}
				placeholder={placeholder}
				help={help}
				confirmationPlaceholder={confirmation_placeholder}
				confirmationLabel={confirmation_label}
				confirmationHelp={confirmation_help}
				confirmation={confirmation}
				required={required}
			></ScOrderPassword>
		</Fragment>
	);
};
