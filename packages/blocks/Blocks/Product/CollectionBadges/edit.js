import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Component Dependencies
 */
import { ScFlex } from '@surecart/components-react';
import classNames from 'classnames';

export default ({ attributes, setAttributes }) => {
	const { collectionCount } = attributes;
	const blockProps = useBlockProps({});
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);
	const borderProps = useBorderProps(attributes);
	const fontStyles = {
		fontFamily: blockProps?.style?.fontFamily,
		fontWeight: blockProps?.style?.fontWeight,
		fontStyle: blockProps?.style?.fontStyle,
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__(
								'Product Collections to display',
								'surecart'
							)}
							value={collectionCount}
							onChange={(collectionCount) =>
								setAttributes({ collectionCount })
							}
							type="number"
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ScFlex gap="1em" justifyContent="flex-start">
					{['Male', 'Female', 'Unisex'].map((collection) => (
						<span
							className={classNames(
								'sc-product-collection-badge',
								colorProps.className,
								spacingProps.className,
								borderProps.className,
								{
									'no-border-radius':
										attributes.style?.border?.radius === 0,
								}
							)}
							style={{
								...fontStyles,
								...colorProps.style,
								...spacingProps.style,
								...borderProps.style,
							}}
							key={collection}
						>
							{collection}
						</span>
					))}
				</ScFlex>
			</div>
		</Fragment>
	);
};
