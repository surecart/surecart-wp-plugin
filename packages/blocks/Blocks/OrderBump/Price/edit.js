import { ScTag } from '@surecart/components-react';
import { ScFormatNumber, ScProductPrice } from '@surecart/components-react';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { Fragment } from 'react';

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
						class="price__scratch"
						type="currency"
						currency={scBlockData?.currency}
						value={2400}
						style={{
							color: '#9CA3AF',
							marginRight: '1rem',
						}}
					/>

					<ScFormatNumber
						type="currency"
						currency={scBlockData?.currency}
						value={1200}
						style={{
							color: '#4B5563',
							marginRight: '1rem',
						}}
					/>

					<ScTag type="primary" pill class="price__sale-badge">
						{!!sale_text && <span>{sale_text}</span>}
					</ScTag>
				</ScProductPrice>
			</div>
		</>
	);
};
