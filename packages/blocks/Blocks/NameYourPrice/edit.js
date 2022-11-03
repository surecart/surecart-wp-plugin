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
import { ScCustomOrderPriceInput } from '@surecart/components-react';
import PriceInfo from '@scripts/blocks/components/PriceInfo';

import PriceSelector from '@scripts/blocks/components/PriceSelector';

export default ({ attributes, setAttributes }) => {
	const { price_id, label, help, show_currency_code, required, placeholder } =
		attributes;

	const blockProps = useBlockProps();

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
						<ToggleControl
							label={__('Required', 'surecart')}
							checked={required}
							onChange={(required) => setAttributes({ required })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Label', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Placeholder', 'surecart')}
							value={placeholder}
							onChange={(placeholder) =>
								setAttributes({ placeholder })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Help', 'surecart')}
							value={help}
							onChange={(help) => setAttributes({ help })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Show Currency Code', 'surecart')}
							checked={show_currency_code}
							onChange={(show_currency_code) =>
								setAttributes({ show_currency_code })
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

			<ScCustomOrderPriceInput
				{...blockProps}
				priceId={price_id}
				label={label}
				placeholder={placeholder}
				help={help}
				showCode={show_currency_code}
				required={required}
			/>
		</Fragment>
	);
};
