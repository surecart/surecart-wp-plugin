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
		style: {
			...attributes,
			minHeight: '400px',
			borderBottom: 'var(--sc-drawer-border)'
		},
	});

	const lineItems = [
		{
			quantity: 2,
			price: {
				name: 'Basic',
				product: {
					name: 'Example Product',
					image_url: 'https://picsum.photos/seed/picsum/200/200',
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
					image_url: 'https://picsum.photos/seed/picsum/200/200',
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
											<div>
												{lineItem?.price?.name}
											</div>
										</div>
										{!editable &&
											lineItem.quantity > 1 && (
												<span className="sc-product-line-item__description">
													{__('Qty:', 'surecart')}{' '}
													{lineItem.quantity}
												</span>
											)}
									</div>
									{editable && (
										<div className="sc-quantity-selector quantity--small">
											<div
												role="button"
												className="sc-quantity-selector__decrease"
											>
												<ScIcon name="minus" />
											</div>
											<input
												className="sc-quantity-selector__control"
												value={lineItem.quantity}
												type="number"
												step="1"
												autocomplete="off"
											/>
											<div
												role="button"
												className="sc-quantity-selector__increase"
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
