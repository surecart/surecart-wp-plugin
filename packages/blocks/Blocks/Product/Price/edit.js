import { ScFormatNumber, ScProductPrice } from '@surecart/components-react';
import {
	AlignmentControl,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default ({ attributes: { textAlign }, setAttributes }) => {
	const blockProps = useBlockProps();

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
				<ScProductPrice>
					<ScFormatNumber
						type="currency"
						currency={scBlockData?.currency}
						value={1900}
					/>
				</ScProductPrice>
			</div>
		</>
	);
};
