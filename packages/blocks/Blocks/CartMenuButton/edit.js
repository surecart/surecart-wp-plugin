/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, PanelRow } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import {
	ScIcon,
	ScChoice,
	ScChoices,
	ScCartButton,
} from '@surecart/components-react';

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
							<ScChoices
								label={__('Icon', 'surecart')}
								onScChange={(e) =>
									setAttributes({
										cart_icon: e.target.value,
									})
								}
								style={{ '--sc-choice-padding': '1.3em' }}
								autoWidth
							>
								<ScChoice
									showControl={false}
									checked={cart_icon === 'shopping-bag'}
									value="shopping-bag"
								>
									<ScIcon name="shopping-bag" />
								</ScChoice>
								<ScChoice
									showControl={false}
									checked={cart_icon === 'shopping-cart'}
									value="shopping-cart"
								>
									<ScIcon name="shopping-cart" />
								</ScChoice>
							</ScChoices>
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
				<ScCartButton cartMenuAlwaysShown={true} showEmptyCount={true}>
					<ScIcon name={cart_icon} />
				</ScCartButton>
			</a>
		</div>
	);
};
