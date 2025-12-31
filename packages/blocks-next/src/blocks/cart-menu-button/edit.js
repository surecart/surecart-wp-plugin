/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, PanelRow } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import ScIcon from '../../components/ScIcon';

export default ({ attributes, setAttributes }) => {
	const { cart_icon, cart_menu_always_shown } = attributes;

	const blockProps = useBlockProps({
		style: {
			fontSize: '16px',
			fontFamily: 'var(--sc-font-sans)',
		},
	});

	return (
		<div>
			<InspectorControls>
				<PanelBody title={__('Settings', 'surecart')}>
					<PanelRow>
						<div
							style={{
								marginBottom: 20,
								width: '100%',
								flex: 'flex-1',
							}}
						>
							<h2 className="components-truncate components-text components-heading">
								{__('Icon', 'surecart')}
							</h2>
							<div className="sc-choices">
								<div
									className={`sc-choice ${
										cart_icon === 'shopping-bag'
											? 'sc-choice--checked'
											: ''
									}`}
									onClick={() =>
										setAttributes({
											cart_icon: 'shopping-bag',
										})
									}
								>
									<ScIcon
										name="shopping-bag"
										class={
											cart_icon === 'shopping-bag'
												? 'active'
												: ''
										}
									/>
								</div>
								<div
									className={`sc-choice ${
										cart_icon === 'shopping-cart'
											? 'sc-choice--checked'
											: ''
									}`}
									onClick={() =>
										setAttributes({
											cart_icon: 'shopping-cart',
										})
									}
								>
									<ScIcon
										name="shopping-cart"
										class={
											cart_icon === 'shopping-cart'
												? 'active'
												: ''
										}
									/>
								</div>
							</div>
						</div>
					</PanelRow>

					<PanelRow>
						<ToggleControl
							label={__('Always show cart', 'surecart')}
							help={__(
								'Enable to always show the cart button, even when your cart is empty.',
								'surecart'
							)}
							checked={cart_menu_always_shown}
							onChange={() =>
								setAttributes({
									cart_menu_always_shown:
										!cart_menu_always_shown,
								})
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<a {...blockProps}>
				<div class="sc-cart-icon">
					<ScIcon name={cart_icon} />
				</div>

				<span class="sc-cart-count">2</span>
			</a>
		</div>
	);
};
