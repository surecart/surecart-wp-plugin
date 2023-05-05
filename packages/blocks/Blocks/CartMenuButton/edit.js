/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	PanelRow,
} from '@wordpress/components';

/**
 * Internal dependencies.
 */
import {
	ScIcon,
	ScChoice,
	ScFlex,
	ScCartButton,
} from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { cartIcon, cartMenuAlwaysShown } = attributes;

	const blockProps = useBlockProps({
		style: {
			fontSize: '16px',
			fontFamily: 'var(--sc-font-sans)',
		},
	});

	return (
		<div>
			<InspectorControls>
				<PanelBody title={__('Cart menu button settings')}>
					<div style={{ marginBottom: 20 }}>
						<label style={{ marginBottom: 10, display: 'block' }}>
							{__('Icon', 'surecart')}
						</label>
						<ScFlex justify-content="flex-start">
							<ScChoice
								showControl={false}
								checked={cartIcon === 'shopping-bag'}
								value={'shopping-bag'}
								onClick={(e) =>
									setAttributes({
										cartIcon: 'shopping-bag',
									})
								}
							>
								<ScIcon name="shopping-bag" />
							</ScChoice>
							<ScChoice
								showControl={false}
								checked={cartIcon === 'shopping-cart'}
								value={'shopping-cart'}
								onClick={(e) =>
									setAttributes({
										cartIcon: 'shopping-cart',
									})
								}
							>
								<ScIcon name="shopping-cart" />
							</ScChoice>
						</ScFlex>
					</div>

					<PanelRow>
						<ToggleControl
							label={__(
								'Always show cart',
								'surecart'
							)}
							help={__(
								'Enable to always show the cart button, even your cart is empty.',
								'surecart'
							)}
							checked={cartMenuAlwaysShown}
							onChange={() =>
								setAttributes({
									cartMenuAlwaysShown: !cartMenuAlwaysShown,
								})
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScCartButton
					cartMenuAlwaysShown={cartMenuAlwaysShown}
					showEmptyCount={true}
					style={{
						border: !cartMenuAlwaysShown ? '1px solid #ccc' : '0',
						padding: !cartMenuAlwaysShown ? 15 : 0,
						borderRadius: !cartMenuAlwaysShown ? 4 : 0
					}}
				>
					<ScIcon name={cartIcon} />
				</ScCartButton>
			</div>
		</div>
	);
};
