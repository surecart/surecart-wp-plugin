import { ScFormatNumber, ScProductPrice } from '@surecart/components-react';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ attributes: { textAlign, sale_text }, setAttributes }) => {
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
			<InspectorControls>
				<PanelBody>
					<TextControl
						label={__('Sale Text', 'surecart')}
						help={__(
							'This text will be displayed if there is a compare at price selected.',
							'surecart'
						)}
						value={sale_text}
						onChange={(sale_text) => setAttributes({ sale_text })}
					/>
				</PanelBody>
			</InspectorControls>

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
