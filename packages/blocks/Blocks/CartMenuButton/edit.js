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
  ScChoices,
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
					<PanelRow>
						<div style={{ marginBottom: 20, width: '100%', flex: 'flex-1' }}>
							<ScChoices
								label={__('Icon', 'surecart')}
								onScChange={(e) =>
									setAttributes({
										cartIcon: e.target.value
									})
								}
								style={{ '--sc-choice-padding': '1.3em' }}
								autoWidth
							>
								<ScChoice
									showControl={false}
									checked={cartIcon === 'shopping-bag'}
									value='shopping-bag'
								>
									<ScIcon name="shopping-bag" />
								</ScChoice>
								<ScChoice
									showControl={false}
									checked={cartIcon === 'shopping-cart'}
									value='shopping-cart'
								>
									<ScIcon name="shopping-cart" />
								</ScChoice>
							</ScChoices>
						</div>
					</PanelRow>

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

			<a {...blockProps}>
				<ScCartButton
					cartMenuAlwaysShown={true}
					showEmptyCount={true}
				>
					<ScIcon name={cartIcon} />
				</ScCartButton>
			</a>
		</div>
	);
};
