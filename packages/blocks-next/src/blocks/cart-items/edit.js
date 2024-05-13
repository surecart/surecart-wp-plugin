/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import ScIcon from '../../components/ScIcon';

export default ({ attributes, setAttributes }) => {
	const { removable, editable } = attributes;

	const blockProps = useBlockProps({
		style: attributes,
	});

	const lineItems = [
		{
			quantity: 2,
			price: {
				name: 'Basic',
				product: {
					name: 'Example Product',
					image_url: 'https://source.unsplash.com/daily',
				},
				display_amount: '$12.34',
			},
		},
		{
			quantity: 4,
			price: {
				name: 'Monthly',
				product: {
					name: 'Example Product',
					image_url: 'https://source.unsplash.com/daily',
				},
				display_amount: '$123.45',
			},
		},
	];

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
				<div
					style={{
						minHeight: '400px',
						borderBottom: 'var(--sc-drawer-border)',
						padding: '1.25em',
					}}
				>
					{lineItems.map((lineItem) => {
						return (
							<div
								class="sc-product-line-item"
								style={{ marginBottom: 20 }}
							>
								<div className="sc-product-line-item__item">
									<img
										src={lineItem.price.product.image_url}
										class="sc-product-line-item__image"
									/>
									<div class="sc-product-line-item__text">
										<div class="sc-product-line-item__text-details">
											<div class="sc-product-line-item__title">
												{lineItem.price.product.name}
											</div>
											<div class="sc-product-line-item__description sc-product-line-item__price-variant">
												<div>
													{lineItem?.price?.name}
												</div>
											</div>
											{!editable &&
												lineItem.quantity > 1 && (
													<span class="sc-product-line-item__description">
														{__('Qty:', 'surecart')}{' '}
														{lineItem.quantity}
													</span>
												)}
										</div>
										{/* {editable && (
											<sc-quantity-select
												max={lineItem.max || Infinity}
												exportparts="base:quantity, minus:quantity__minus, minus-icon:quantity__minus-icon, plus:quantity__plus, plus-icon:quantity__plus-icon, input:quantity__input"
												clickEl={lineItem.el}
												quantity={lineItem.quantity}
												size="small"
												onScChange={(e) =>
													e.detail &&
													lineItem.scUpdateQuantity.emit(
														e.detail
													)
												}
												aria-label={sprintf(
													__(
														'Change Quantity - %s %s',
														'surecart'
													),
													lineItem.name,
													lineItem.price.name
												)}
											></sc-quantity-select>
										)} */}
									</div>
									<div class="sc-product-line-item__suffix">
										{!!removable ? (
											<ScIcon
												class="sc-product-line-item__remove"
												name="x"
												onClick={() =>
													lineItem.scRemove.emit()
												}
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														lineItem.scRemove.emit();
													}
												}}
												tabindex="0"
												aria-label={sprintf(
													__(
														'Remove Item - %s %s',
														'surecart'
													),
													lineItem.name,
													lineItem.priceName
												)}
											></ScIcon>
										) : (
											<div></div>
										)}

										<div class="sc-product-line-item__price">
											<div class="price">
												{lineItem.price.display_amount}
											</div>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};
