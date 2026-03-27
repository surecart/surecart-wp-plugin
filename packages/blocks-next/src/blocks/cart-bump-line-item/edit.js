/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import useCartStyles from '../../hooks/useCartStyles';
import CartInspectorControls from '../../components/CartInspectorControls';

export default ({ attributes, setAttributes }) => {
	const { label } = attributes;

	const blockProps = useBlockProps({
		style: {
			...{
				color: 'var(--sc-price-label-color, var(--sc-input-help-text-color))',
			},
			...useCartStyles({ attributes }),
		},
	});

	return (
		<Fragment>
			<InspectorControls>
				<CartInspectorControls
					attributes={attributes}
					setAttributes={setAttributes}
				/>

				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="sc-product-line-item">
					<div className="sc-product-line-item__item">
						<div className="sc-product-line-item__text">
							<div className="sc-product-line-item__text-details">
								<div className="sc-bump-line-item__description">
									<span>
										{label ||
											__('Bundle Discount', 'surecart')}
									</span>
								</div>
							</div>
						</div>

						<div className="sc-product-line-item__suffix">
							<div className="sc-bump-line-item__price">
								<div className="price">
									<span>-{scData?.currency_symbol}1.20</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};
