import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { ScPriceChoice, ScPriceInput } from '@surecart/components-react';
import PriceInfo from './components/PriceInfo';

import PriceSelector from '@scripts/blocks/components/PriceSelector';

export default ({ attributes, setAttributes, isSelected }) => {
	const {
		price_id,
		label,
		help,
		type,
		quantity,
		show_label,
		show_price,
		show_control,
		checked,
	} = attributes;

	const blockProps = useBlockProps({
		style: { width: '100%' },
	});

	if (!price_id) {
		return (
			<div {...blockProps}>
				<PriceSelector
					ad_hoc={true}
					onSelect={(price_id) => setAttributes({ price_id })}
				/>
			</div>
		);
	}

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
					<PanelRow>
						<TextControl
							label={__('Help', 'surecart')}
							value={help}
							onChange={(help) => setAttributes({ help })}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title={__('Product Info', 'surecart')}>
					<PanelRow>
						<PriceInfo price_id={price_id} />
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<ScPriceInput
				{...blockProps}
				priceId={price_id}
				type={type}
				label={label}
				showPrice={show_price}
				showControl={show_control}
				help={help}
				checked={checked}
				quantity={quantity}
			/>
		</Fragment>
	);
};
