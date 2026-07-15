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

export default ({ attributes, setAttributes }) => {
	const { type, label, submit, size, show_icon, redirectToCurrent } =
		attributes;

	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Logout button settings', 'surecart')}>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Redirect to current URL', 'surecart')}
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
							__nextHasNoMarginBottom
							label={__('Show icon', 'surecart')}
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

			<ScButton type={type} submit={submit} size={size}>
				{show_icon && (
					<sc-icon name="log-out" slot="prefix"></sc-icon>
				)}

				<RichText
					aria-label={__('Button text', 'surecart')}
					placeholder={__('Add text…', 'surecart')}
					value={label}
					onChange={(label) => setAttributes({ label })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</ScButton>
		</div>
	);
};
