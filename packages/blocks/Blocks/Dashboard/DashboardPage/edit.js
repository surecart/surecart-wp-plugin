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

export default ({ attributes, setAttributes }) => {
	const { name, gap } = attributes;

	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;

	const blockProps = useBlockProps({
		name,
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		templateLock: false,
		renderAppender: InnerBlocks.ButtonBlockAppender,
	});

	return (
		<Fragment>
			<style>{`
				.sc-dashboard-page-editor > .wp-block:not(sc-columns):not(sc-column):not(:last-child) {
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
			<ScTabPanel
				className="sc-dashboard-page-editor"
				{...innerBlocksProps}
			></ScTabPanel>
		</Fragment>
	);
};
