/** @jsx jsx */
import { css, jsx } from '@emotion/core';
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
import { CeTabPanel } from '@checkout-engine/components-react';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { name } = attributes;

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
			<InspectorControls>
				<PanelBody title={__('Attributes', 'checkout-engine')}>
					<PanelRow>
						<TextControl
							label={__('Url Slug', 'checkout-engine')}
							value={name}
							onChange={(name) => setAttributes({ name })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<CeTabPanel name={name}>
				<ce-spacing {...innerBlocksProps}></ce-spacing>
			</CeTabPanel>
		</Fragment>
	);
};
