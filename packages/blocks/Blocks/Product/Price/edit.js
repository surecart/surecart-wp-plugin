import { ScPrice } from '@surecart/components-react';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

export default ({ attributes: { alignment, sale_text }, setAttributes }) => {
	const blockProps = useBlockProps({
		className: classNames({
			[`has-text-align-${alignment}`]: alignment,
		}),
	});

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={alignment}
					onChange={(nextAlign) => {
						setAttributes({ alignment: nextAlign });
					}}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody>
					<TextControl
						label={__('Sale Text', 'surecart')}
						help={__(
							'This will be displayed if there is a compare at price, or an upsell discount.',
							'surecart'
						)}
						value={sale_text}
						onChange={(sale_text) => setAttributes({ sale_text })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScPrice
					currency={scBlockData?.currency}
					amount={7900}
					scratchAmount={9900}
					saleText={sale_text}
				/>
			</div>
		</>
	);
};
