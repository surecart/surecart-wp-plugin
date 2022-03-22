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
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { ScButton } from '@surecart/components-react';
import Placeholder from './Placeholder';

export default ({ className, attributes, setAttributes }) => {
	const { type, label, size, line_items } = attributes;

	const renderButton = () => {
		if (!line_items || !line_items?.length) {
			return <Placeholder setAttributes={setAttributes} />;
		}

		return (
			<ScButton type={type} size={size}>
				<RichText
					aria-label={__('Button text')}
					placeholder={__('Add text…')}
					value={label}
					onChange={(label) => setAttributes({ label })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</ScButton>
		);
	};

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
									value: 'text',
									label: __('Text Link', 'surecart'),
								},
							]}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			{renderButton()}
		</div>
	);
};
