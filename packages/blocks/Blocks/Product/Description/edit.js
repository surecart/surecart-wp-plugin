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
						'Experience the next level of convenience with our innovative widget. Melding cutting-edge technology with user-friendly design, this product provides unparalleled functionality that caters to your lifestyle.',
						'surecart'
					)}
				</ScProductText>
			</div>
		</>
	);
};
