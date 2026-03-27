/**
 * WordPress dependencies.
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import template from './template';

export default () => {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template,
	});
	return <div {...innerBlocksProps} />;
};
