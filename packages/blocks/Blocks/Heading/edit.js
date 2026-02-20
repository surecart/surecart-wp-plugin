/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	InspectorControls,
	InnerBlocks,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { ScHeading } from '@surecart/components-react';

export default ({ attributes, setAttributes, isSelected }) => {
	const { title, description } = attributes;

	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Title', 'surecart')}
							value={title}
							onChange={(title) => setAttributes({ title })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Description', 'surecart')}
							value={description}
							onChange={(description) =>
								setAttributes({ description })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScHeading>
					<RichText
						aria-label={__('Title', 'surecart')}
						placeholder={__('Add your title...', 'surecart')}
						value={title}
						onChange={(title) => setAttributes({ title })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>

					{(isSelected || !!description) && (
						<span slot="description">
							<RichText
								aria-label={__('Description', 'surecart')}
								placeholder={__(
									'Add your description...',
									'surecart'
								)}
								value={description}
								onChange={(description) =>
									setAttributes({ description })
								}
								withoutInteractiveFormatting
								allowedFormats={['core/bold', 'core/italic']}
							/>
						</span>
					)}

					<div slot="end">
						<InnerBlocks />
					</div>
				</ScHeading>
			</div>
		</Fragment>
	);
};
