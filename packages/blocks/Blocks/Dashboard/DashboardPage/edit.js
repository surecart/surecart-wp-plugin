/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { ScTabPanel } from '@surecart/components-react';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

export default ({ attributes, setAttributes, clientId }) => {
	const { name, gap } = attributes;
	const instanceClass = `sc-dashboard-page-editor-${clientId}`;

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const blockProps = useBlockProps({
		name,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			templateLock: false,
			renderAppender: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<Fragment>
			<style>{`
				.${instanceClass} > .wp-block:not(sc-columns):not(sc-column):not(:last-child) {
					margin-bottom: ${gap} !important;
				}
			`}</style>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={__('Url Slug', 'surecart')}
							value={name}
							onChange={(name) => setAttributes({ name })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<ScTabPanel
					className={instanceClass}
					{...innerBlocksProps}
				></ScTabPanel>
			</div>
		</Fragment>
	);
};
