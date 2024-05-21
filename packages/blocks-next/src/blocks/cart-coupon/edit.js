/**
 * Internal dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import ScIcon from '../../components/ScIcon';

/**
 * External dependencies.
 */
// import { ScCouponForm } from '@surecart/components-react';
// import useCartStyles from '../../../../blocks/hooks/useCartStyles';

export default ({ attributes, setAttributes }) => {
	const { text, button_text, collapsed, placeholder } = attributes;

	const blockProps = useBlockProps();

	const [discountInputOpen, setDiscountInputOpen] = useState(false);
	const [discountCode, setDiscountCode] = useState('');
	const [discountApplied, setDiscountApplied] = useState(false);
	const [discountIsRedeemable, setDiscountIsRedeemable] = useState(true);

	const renderDiscountedState = () => {
		return (
			<div
				class="sc-line-item__item sc-coupon-form"
				hidden={!discountApplied}
			>
				<div class="sc-line-item__text">
					<div class="sc-line-item__description">
						{__('Discount', 'surecart')}
						<span class="sc-tag sc-tag--default">
							{discountCode}

							<button
								onClick={() => {
									setDiscountApplied(false);
									setDiscountCode('');
								}}
							>
								<ScIcon name="x" />
							</button>
						</span>
					</div>
				</div>

				<div class="sc-line-item__end">
					<div class="sc-line-item__price-text">
						<div class="sc-line-item__price-description">
							<span>
								<span
									class="coupon-human-discount"
									hidden={!discountIsRedeemable}
								>
									{'$50.00'}
								</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderDiscountInput = () => {
		return (
			<div
				hidden={!discountInputOpen && collapsed}
				class="sc-input-group sc-coupon-form__input-group"
			>
				<input
					type="text"
					id="coupon"
					class="sc-form-control sc-coupon-form__input"
					aria-label="quantity"
					aria-describedby="basic-addon1"
					placeholder={_('Enter coupon code', 'surecart')}
					value={discountCode}
					onChange={(e) => setDiscountCode(e.target.value)}
				/>
				<span class="sc-input-group-text" id="basic-addon1">
					<button
						hidden={!discountCode}
						onClick={() => {
							setDiscountInputOpen(false);
							setDiscountApplied(true);
						}}
					>
						{__('Apply', 'surecart')}
					</button>
				</span>
			</div>
		);
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__('Collapsed', 'surecart')}
							checked={collapsed}
							onChange={(collapsed) =>
								setAttributes({ collapsed })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={text}
							onChange={(text) => setAttributes({ text })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Placeholder', 'surecart')}
							value={placeholder}
							onChange={(placeholder) =>
								setAttributes({ placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Button Text', 'surecart')}
							value={button_text}
							onChange={(button_text) =>
								setAttributes({ button_text })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="sc-cart-coupon__wrapper">
					{discountApplied ? (
						renderDiscountedState()
					) : (
						<>
							{collapsed ? (
								<div>
									<span
										hidden={discountInputOpen}
										class="trigger"
										onClick={() =>
											setDiscountInputOpen(true)
										}
									>
										{text}
									</span>
									{renderDiscountInput()}
								</div>
							) : (
								<div>
									<label
										class="sc-form-label"
										for="sc-coupon-input"
									>
										{text}
									</label>
									{renderDiscountInput()}
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</Fragment>
	);
};
