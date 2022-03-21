/**
 * WordPress dependencies
 */
import {
	PanelBody,
	ToggleControl,
	PanelRow,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { ScButton } from '@surecart/components-react';

export default ({ className, attributes, setAttributes }) => {
	const { type, label, submit, size, show_icon, redirectToCurrent } =
		attributes;

	return (
		<div className={className}>
			<InspectorControls>
				<PanelBody title={__('Logout button settings')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Redirect to current URL')}
							checked={redirectToCurrent}
							onChange={() =>
								setAttributes({
									redirectToCurrent: !redirectToCurrent,
								})
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show icon')}
							checked={show_icon}
							onChange={() =>
								setAttributes({
									show_icon: !show_icon,
								})
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div
				{...useBlockProps({
					className: 'logged-in',
				})}
			>
				<ScButton type={type} submit={submit} size={size} type={type}>
					{show_icon && (
						<sc-icon name="log-out" slot="prefix"></sc-icon>
					)}

					<RichText
						aria-label={__('Button text')}
						placeholder={__('Add text…')}
						value={label}
						onChange={(label) => setAttributes({ label })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				</ScButton>
			</div>
		</div>
	);
};
