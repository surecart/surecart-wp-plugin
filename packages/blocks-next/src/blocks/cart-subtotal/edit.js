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
// import useCartStyles from '../../../../blocks/hooks/useCartStyles';

export default ({ attributes, setAttributes }) => {
	const { label } = attributes;
	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
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
				<div
					className="sc-product-line-item"
					style={{ marginBottom: '20px', borderBottom: 'none' }}
				>
					<div className="sc-product-line-item__item">
						<div className="sc-product-line-item__text">
							<div className="sc-product-line-item__text-details">
								<div className="sc-product-line-item__title">
									<span>
										{label || __('Subtotal', 'surecart')}
									</span>
								</div>
							</div>
						</div>

						<div className="sc-product-line-item__suffix">
							<div className="sc-product-line-item__price">
								<div className="price">
									<span>$1,35.79</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};
