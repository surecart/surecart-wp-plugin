import { __, sprintf } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import { CeSessionDetail } from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { value, label } = attributes;
	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<SelectControl
							value={value}
							options={[
								{
									label: 'Customer Name',
									value: 'customer.name',
								},
								{
									label: 'Customer Email',
									value: 'customer.email',
								},
								{
									label: 'Customer Phone',
									value: 'customer.phone',
								},
								{
									label: 'Promo Code',
									value: 'discount.promotion.code',
								},
								{
									label: 'Coupon Amount Off',
									value: 'discount.coupon.amount_off',
								},
								{
									label: 'Coupon Percent Off',
									value: 'discount.coupon.percent_off',
								},
								{
									label: 'Total',
									value: 'total_amount',
								},
								{
									label: 'Subtotal',
									value: 'subtotal_amount',
								},
								{
									label: 'Discount',
									value: 'discount_amount',
								},
								{
									label: 'Order Status',
									value: 'status',
								},
								{
									label: 'Order Number',
									value: 'number',
								},
							]}
							onChange={(value) => setAttributes({ value })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div style={{ minHeight: '20px' }}>
				<CeSessionDetail
					label={label}
					value={value}
					fallback={__(
						'(Not in this example order, but will be conditionally displayed)',
						'surecart'
					)}
				></CeSessionDetail>
			</div>
		</Fragment>
	);
};
