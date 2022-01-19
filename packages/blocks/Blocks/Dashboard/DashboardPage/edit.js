/** @jsx jsx */
import { css, jsx } from '@emotion/core';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { CeTabPanel } from '@checkout-engine/components-react';

export default ({ attributes }) => {
	const { name } = attributes;
	const blockProps = useBlockProps({
		name,
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		templateLock: false,
		renderAppender: InnerBlocks.ButtonBlockAppender,
	});

	return (
		<Fragment>
			<CeTabPanel name={name}>
				<ce-spacing {...innerBlocksProps}></ce-spacing>
			</CeTabPanel>
		</Fragment>
	);
};
