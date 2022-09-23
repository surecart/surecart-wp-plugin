import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { PanelBody, PanelRow } from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	ScChoice,
	ScFormatNumber,
	ScInput,
	ScPriceInput,
} from '@surecart/components-react';

export default ({ attributes, setAttributes }) => {
	const { label, amount, currency } = attributes;
  console.log(attributes);

	const blockProps = useBlockProps();

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
          <PanelRow>
            <ScInput
              label={__('Name the Price', 'surecart')}
              name="label"
              placeholder="Buy me coffee!"
              value={label}
              onScInput={(e) => {
                console.log(e.target.value);
								setAttributes({
									label: e.target.value,
								})
							}}
            ></ScInput>
          </PanelRow>
					<PanelRow>
						<ScPriceInput
							label={__('Amount', 'surecart')}
							currencyCode={currency}
							value={amount}
							onScChange={(e) =>
								setAttributes({
									amount: parseInt(e.target.value),
								})
							}
						></ScPriceInput>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<ScChoice
				showControl={false}
				size="small"
				value={amount}
				{...blockProps}
			>
				{!!label ? label : <ScFormatNumber
					type="currency"
					currency={currency || 'USD'}
					value={amount}
					minimum-fraction-digits="0"
				></ScFormatNumber>}
			</ScChoice>
		</Fragment>
	);
};
