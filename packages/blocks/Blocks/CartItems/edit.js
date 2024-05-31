/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { ScProductLineItem } from '@surecart/components-react';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import CartInspectorControls from '../../components/CartInspectorControls';
import useCartStyles from '../../hooks/useCartStyles';

export default ({ attributes, setAttributes }) => {
	const { removable, editable } = attributes;

	const blockProps = useBlockProps({
		style: useCartStyles({ attributes }),
	});

	const placeholderImageUrl =
		scBlockData?.plugin_url + '/images/placeholder.jpg';

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
				<div style={{ minHeight: '400px' }}>
					<ScProductLineItem
						removable={removable}
						editable={editable}
						imageUrl={placeholderImageUrl}
						amount={12345}
						currency={scData?.currency || 'usd'}
						name={__('Example Product', 'surecart')}
						priceName={__('Basic', 'surecart')}
					></ScProductLineItem>
					<ScProductLineItem
						removable={removable}
						editable={editable}
						amount={1234}
						interval={__('every month', 'surecart')}
						currency={scData?.currency || 'usd'}
						imageUrl={placeholderImageUrl}
						name={__('Example Product', 'surecart')}
						priceName={__('Monthly', 'surecart')}
						style={{ marginTop: '20px' }}
					></ScProductLineItem>
				</div>
			</div>
		</>
	);
};
