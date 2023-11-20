/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { ScProductText } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import useProductPageWarning from '../../../hooks/useProductPageWarning';

export default ({ attributes: { textAlign }, setAttributes }) => {
	const blockProps = useBlockProps({
		className: classnames({
			[`has-text-align-${textAlign}`]: textAlign,
		}),
	});

	const warning = useProductPageWarning();
	if (warning) {
		return <div {...blockProps}>{warning}</div>;
	}

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={textAlign}
					onChange={(nextAlign) => {
						setAttributes({ textAlign: nextAlign });
					}}
				/>
			</BlockControls>

			<div {...blockProps}>
				<ScProductText text="description">
					{__(
						'Introducing our versatile and sustainable women\'s product, crafted with premium quality materials to elevate your style game.',
						'surecart'
					)}
				</ScProductText>
			</div>
		</>
	);
};
