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

			<div {...blockProps}>
				<ScProductText text="description">
					The Basic Tee 6-Pack allows you to fully express your
					vibrant personality with three grayscale options. Feeling
					adventurous? Put on a heather gray tee. Want to be a
					trendsetter? Try our exclusive colorway: "Black". Need to
					add an extra pop of color to your outfit? Our white tee has
					you covered.
				</ScProductText>
			</div>
		</>
	);
};
