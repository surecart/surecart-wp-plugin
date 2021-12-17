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
	__experimentalUseInnerBlocksProps as useInnerBlocksProps,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { TextControl, PanelBody, PanelRow } from '@wordpress/components';
import { CeTabPanel } from '@checkout-engine/react';

export default ( { attributes, setAttributes } ) => {
	const { name, id } = attributes;
	const blockProps = useBlockProps( {
		name,
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: false,
		renderAppender: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<Fragment>
			<CeTabPanel { ...innerBlocksProps }></CeTabPanel>
		</Fragment>
	);
};
