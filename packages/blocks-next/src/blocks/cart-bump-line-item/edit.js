/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';

/**
 * Component Dependencies
 */
import useCartStyles from '../../../../blocks/hooks/useCartStyles';

export default ({ attributes, setAttributes }) => {
	const { label } = attributes;

	const blockProps = useBlockProps({
		style: useCartStyles({ attributes }),
	});

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
				<div className="sc-product-line-item">
					<div className="sc-product-line-item__item">
						<div className="sc-product-line-item__text">
							<div className="sc-product-line-item__text-details">
								<div className="sc-product-line-item__description">
									<span>
										{label ||
											__('Bundle Discount', 'surecart')}
									</span>
								</div>
							</div>
						</div>

						<div className="sc-product-line-item__suffix">
							<div className="sc-product-line-item__price">
								<div className="price">
									<span>-$1.20</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};
