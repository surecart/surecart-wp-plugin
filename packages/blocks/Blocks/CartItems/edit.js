/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScProductLineItem } from '@surecart/components-react';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const blockProps = useBlockProps({
		css: css`
			padding: var(--sc-drawer-body-spacing);
			min-height: 400px;
			sc-product-line-item ~ sc-product-line-item,
			sc-line-item ~ sc-line-item {
				margin-top: 20px;
			}
		`,
	});
	const { removable, editable } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__('Removable', 'surecart')}
							help={__(
								'Allow line items to be removed.',
								'surecart'
							)}
							checked={removable}
							onChange={(removable) =>
								setAttributes({ removable })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Editable', 'surecart')}
							help={__(
								'Allow line item quantities to be editable.',
								'surecart'
							)}
							checked={editable}
							onChange={(editable) => setAttributes({ editable })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScProductLineItem
					removable={removable}
					editable={editable}
					imageUrl="https://source.unsplash.com/daily"
					amount={12345}
					currency={scData?.currency || 'usd'}
					name={__('Example Product', 'surecart')}
				></ScProductLineItem>
				<ScProductLineItem
					removable={removable}
					editable={editable}
					amount={1234}
					interval={__('every month')}
					currency={scData?.currency || 'usd'}
					imageUrl="https://source.unsplash.com/daily"
					name={__('Example Product', 'surecart')}
				></ScProductLineItem>
			</div>
		</>
	);
};
