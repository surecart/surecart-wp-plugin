import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Component Dependencies
 */
import classNames from 'classnames';
import { useSelect } from '@wordpress/data';

const FALLBACK_COLLECTIONS = [
	{ id: '1', name: 'Collection' },
	{ id: '2', name: 'Collection 2' },
	{ id: '3', name: 'Collection 3' },
];

export default ({ attributes, setAttributes }) => {
	const { count, style } = attributes;
	const { blockGap } = style?.spacing || {};
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);
	const borderProps = useBorderProps(attributes);
	const fontStyles = {
		fontFamily: blockProps?.style?.fontFamily,
		fontWeight: blockProps?.style?.fontWeight,
		fontStyle: blockProps?.style?.fontStyle,
	};

	const blockProps = useBlockProps({
		className: 'is-layout-flex',
		style: {
			...(!!blockGap ? { gap: blockGap } : {}),
		},
	});

	const collections = useSelect((select) =>
		select(coreStore).getEntityRecords('surecart', 'product-collection')
	);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__(
								'Product collections to display',
								'surecart'
							)}
							value={count}
							onChange={(count) => setAttributes({ count })}
							type="number"
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{(collections || FALLBACK_COLLECTIONS)
					.map((collection) => collection.name)
					.slice(0, count)
					.map((collection) => (
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
							key={collection?.id}
						>
							{collection}
						</span>
					))}
			</div>
		</Fragment>
	);
};
