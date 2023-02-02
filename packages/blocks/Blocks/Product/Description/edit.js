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

export default ({ attributes: { textAlign }, setAttributes }) => {
	const blockProps = useBlockProps({
		className: classnames({
			[`has-text-align-${textAlign}`]: textAlign,
		}),
	});

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

			<p {...blockProps}>
				<ScProductText text="description"></ScProductText>
			</p>
		</>
	);
};
