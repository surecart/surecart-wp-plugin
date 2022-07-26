/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScProductLineItem,
	ScStackedListRow,
} from '@surecart/components-react';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';
import useCartBlockProps from '../../hooks/useCartBlockProps';
import CartInspectorControls from '../../components/CartInspectorControls';
import useCartStyles from '../../hooks/useCartStyles';

export default ({ attributes, setAttributes }) => {
	const { removable, editable } = attributes;

	const blockProps = useBlockProps({
		style: useCartStyles({ attributes }),
	});

	return (
		<>
			<InspectorControls>
				<CartInspectorControls
					attributes={attributes}
					setAttributes={setAttributes}
				/>
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
				<div
					css={css`
						min-height: 400px;
						sc-product-line-item ~ sc-product-line-item,
						sc-line-item ~ sc-line-item {
							margin-top: 20px;
						}
					`}
				>
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
						interval={__('every month', 'surecart')}
						currency={scData?.currency || 'usd'}
						imageUrl="https://source.unsplash.com/daily"
						name={__('Example Product', 'surecart')}
					></ScProductLineItem>
				</div>
			</div>
		</>
	);
};
