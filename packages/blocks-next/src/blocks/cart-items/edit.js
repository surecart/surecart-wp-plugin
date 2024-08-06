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
import useCartStyles from '../../hooks/useCartStyles';
import CartInspectorControls from '../../components/CartInspectorControls';

export default ({ attributes, setAttributes }) => {
	const { removable, editable } = attributes;

	const blockProps = useBlockProps({
		style: {
			minHeight: '400px',
			...useCartStyles({ attributes }),
		},
	});

	const placeholderImageUrl =
		scBlockData?.plugin_url + '/images/placeholder-thumbnail.jpg';

	const lineItems = [
		{
			quantity: 2,
			price: {
				name: 'Basic',
				product: {
					name: 'Example Product',
					image_url: placeholderImageUrl,
				},
				display_amount: scData?.currency_symbol + '12.34',
			},
		},
		{
			quantity: 4,
			price: {
				name: 'Monthly',
				product: {
					name: 'Example Product',
					image_url: placeholderImageUrl,
				},
				display_amount: scData?.currency_symbol + '123.45',
			},
		},
	];

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
				{lineItems.map((lineItem) => {
					return (
						<div
							className="sc-product-line-item"
							style={{ marginBottom: 20 }}
						>
							<div className="sc-product-line-item__item">
								<img
									src={lineItem.price.product.image_url}
									className="sc-product-line-item__image"
								/>
								<div className="sc-product-line-item__text">
									<div className="sc-product-line-item__text-details">
										<div className="sc-product-line-item__title">
											{lineItem.price.product.name}
										</div>
										<div className="sc-product-line-item__description sc-product-line-item__price-variant">
											<div>{lineItem?.price?.name}</div>
										</div>
										{!editable && lineItem.quantity > 1 && (
											<span className="sc-product-line-item__description">
												{__('Qty:', 'surecart')}{' '}
												{lineItem.quantity}
											</span>
										)}
									</div>
									{editable && (
										<div className="sc-input-group sc-quantity-selector">
											<div
												className="sc-input-group-text sc-quantity-selector__decrease"
												role="button"
												tabindex="0"
												aria-label="<?php echo esc_html__( 'Decrease quantity by one.', 'surecart' ); ?>"
											>
												<ScIcon name="minus" />
											</div>
											<input
												type="number"
												className="sc-form-control sc-quantity-selector__control"
												value={lineItem.quantity}
												step="1"
												autocomplete="off"
												role="spinbutton"
											/>
											<div
												className="sc-input-group-text sc-quantity-selector__increase"
												role="button"
												tabindex="0"
												aria-label="<?php echo esc_html__( 'Increase quantity by one.', 'surecart' ); ?>"
											>
												<ScIcon name="plus" />
											</div>
										</div>
									)}
								</div>
								<div className="sc-product-line-item__suffix">
									{!!removable ? (
										<ScIcon
											className="sc-product-line-item__remove"
											name="x"
										></ScIcon>
									) : (
										<div></div>
									)}

									<div className="sc-product-line-item__price">
										<div className="price">
											{lineItem.price.display_amount}
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
};
