/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useRef, useState } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * Internal dependencies.
 */
import ScIcon from '../../components/ScIcon';
import CartInspectorControls from '../../components/CartInspectorControls';
import useCartStyles from '../../hooks/useCartStyles';

export default ({ attributes, setAttributes }) => {
	const { text, button_text, collapsed, placeholder } = attributes;
	const discountInputRef = useRef();

	const blockProps = useBlockProps({
		style: useCartStyles({ attributes }),
	});

	const [discountInputOpen, setDiscountInputOpen] = useState(false);
	const [prmotionCode, setPromotionCode] = useState('');
	const [promotionApplied, setPromotionApplied] = useState(false);
	const [discountIsRedeemable, setDiscountIsRedeemable] = useState(true);

	useEffect(() => {
		function handleOutsideClick(event) {
			if (
				discountInputRef.current &&
				!discountInputRef.current.contains(event.target)
			) {
				if (discountInputOpen) {
					setDiscountInputOpen(!discountInputOpen);
				}
			}
		}

		// Bind the event listener
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [discountInputOpen]);

	const renderDiscountedState = () => {
		return (
			<div
				class="sc-line-item__item sc-coupon-form"
				hidden={!promotionApplied}
			>
				<div class="sc-line-item__text">
					<div class="sc-line-item__description">
						{__('Discount', 'surecart')}
						<div class="sc-tag sc-tag--default">
							{prmotionCode}

							<button
								onClick={() => {
									setPromotionApplied(false);
									setPromotionCode('');
								}}
							>
								<ScIcon name="x" />
							</button>
						</div>
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
									-{scData?.currency_symbol}50.00
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
				ref={discountInputRef}
			>
				<input
					type="text"
					id="coupon"
					class="sc-form-control sc-coupon-form__input"
					aria-label={__('Coupon code', 'surecart')}
					aria-describedby="basic-addon1"
					placeholder={
						placeholder || __('Enter coupon code', 'surecart')
					}
					value={prmotionCode}
					onChange={(e) => setPromotionCode(e.target.value)}
				/>
				<span class="sc-input-group-text" id="basic-addon1">
					<button
						hidden={!prmotionCode}
						onClick={() => {
							setDiscountInputOpen(false);
							setPromotionApplied(true);
						}}
					>
						{button_text || __('Apply', 'surecart')}
					</button>
				</span>
			</div>
		);
	};

	return (
		<Fragment>
			<InspectorControls>
				<CartInspectorControls
					attributes={attributes}
					setAttributes={setAttributes}
				/>

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
					{promotionApplied ? (
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
									<label for="sc-coupon-input">{text}</label>
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
