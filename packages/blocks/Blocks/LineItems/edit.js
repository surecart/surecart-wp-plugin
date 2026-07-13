/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	TextControl,
	Disabled,
} from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
	const { removable, editable, showAllBundleItems, separator } = attributes;
	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Removable', 'surecart')}
							help={__(
								'Allow line items to be removed.',
								'surecart'
							)}
							checked={removable}
							onChange={(removable) =>
								setAttributes({ removable })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Editable', 'surecart')}
							help={__(
								'Allow line item quantities to be editable.',
								'surecart'
							)}
							checked={editable}
							onChange={(editable) => setAttributes({ editable })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							__nextHasNoMarginBottom
							label={__('Show all bundle items', 'surecart')}
							help={__(
								'List every product included in a bundle. When off, only items with a selected variant are shown.',
								'surecart'
							)}
							checked={showAllBundleItems}
							onChange={(showAllBundleItems) =>
								setAttributes({ showAllBundleItems })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							__nextHasNoMarginBottom
							label={__('Bundle item separator', 'surecart')}
							help={__(
								'Character shown between a bundle item and its variant options (e.g. · or -).',
								'surecart'
							)}
							value={separator}
							onChange={(separator) =>
								setAttributes({ separator })
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<Disabled>
					<sc-line-items
						removable={removable}
						editable={editable}
						show-all-bundle-items={
							showAllBundleItems ? '1' : 'false'
						}
						separator={separator}
					></sc-line-items>
				</Disabled>
			</div>
		</Fragment>
	);
};
