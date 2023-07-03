/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		isStackedOnMobile,
		verticalAlignment,
		isFullHeight,
		isReversedOnMobile,
	} = attributes;

	const className = classnames({
		[`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
		[`is-not-stacked-on-mobile`]: !isStackedOnMobile,
		[`is-full-height`]: isFullHeight,
		[`is-reversed-on-mobile`]: isReversedOnMobile,
	});

	const blockProps = useBlockProps.save({ className });
	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlocksProps} />;
}
