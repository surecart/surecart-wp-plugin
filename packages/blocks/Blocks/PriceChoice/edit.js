import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	Disabled,
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Component Dependencies
 */
import { ScPriceChoice } from '@surecart/components-react';
import PriceInfo from '@scripts/blocks/components/PriceInfo';

import PriceSelector from '@scripts/blocks/components/PriceSelector';

export default ({ attributes, setAttributes, isSelected }) => {
	const {
		price_id,
		label,
		description,
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
					ad_hoc={false}
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
							label={__('Description', 'surecart')}
							value={description}
							onChange={(description) =>
								setAttributes({ description })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Checked By Default', 'surecart')}
							checked={checked}
							onChange={(checked) => setAttributes({ checked })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show Label', 'surecart')}
							checked={show_label}
							onChange={(show_label) =>
								setAttributes({ show_label })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show Price Amount', 'surecart')}
							checked={show_price}
							onChange={(show_price) =>
								setAttributes({ show_price })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show control', 'surecart')}
							checked={show_control}
							onChange={(show_control) =>
								setAttributes({ show_control })
							}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title={__('Product Info', 'surecart')}>
					<PanelRow>
						<PriceInfo price_id={price_id} />
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<ScPriceChoice
				{...blockProps}
				onClick={(e) => e.preventDefault()}
				priceId={price_id}
				type={type}
				label={label}
				showLabel={show_label}
				showPrice={show_price}
				showControl={show_control}
				description={description}
				checked={checked}
				quantity={quantity}
			/>
		</Fragment>
	);
};
