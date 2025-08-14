/** @jsx jsx */
import { css, jsx } from '@emotion/core';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { ScButton } from '@surecart/components-react';

export default ({ className, attributes, setAttributes }) => {
	const { type, label, submit, size, show_icon, full } = attributes;

	const blockProps = useBlockProps();

	return (
		<div className={className} css={css``}>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Button Text', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							checked={show_icon}
							label={__('Show Icon', 'surecart')}
							onChange={(show_icon) =>
								setAttributes({ show_icon })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Full', 'surecart')}
							checked={full}
							onChange={(full) => setAttributes({ full })}
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label={__('Size', 'surecart')}
							value={size}
							onChange={(size) => {
								setAttributes({ size });
							}}
							options={[
								{
									value: null,
									label: 'Select a Size',
									disabled: true,
								},
								{
									value: 'small',
									label: __('Small', 'surecart'),
								},
								{
									value: 'medium',
									label: __('Medium', 'surecart'),
								},
								{
									value: 'large',
									label: __('Large', 'surecart'),
								},
							]}
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label={__('Type', 'surecart')}
							value={type}
							onChange={(type) => {
								setAttributes({ type });
							}}
							options={[
								{
									value: 'primary',
									label: __('Button', 'surecart'),
								},
								{
									value: 'info',
									label: __('Info', 'surecart'),
								},
							]}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScButton
					type={type}
					submit={submit}
					size={size}
					full={full ? true : null}
				>
					{show_icon && (
						<svg
							slot="prefix"
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
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
		</div>
	);
};
