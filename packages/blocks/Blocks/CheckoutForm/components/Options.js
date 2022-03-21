import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
	CeButton,
	CeFormSection,
	CeSelect,
	CeRadioGroup,
	CeRadio,
} from '@checkout-engine/components-react';
import SelectProduct from './SelectProductModal';
import Choice from './Choice';

export default ({ attributes, setAttributes }) => {
	const [open, setOpen] = useState(false);
	const { choices } = attributes;

	const clear = () => {
		setAttributes({ choices: [] });
	};

	return (
		<div>
			<CeFormSection label="Products">
				{Object.keys(choices).map((id) => {
					const product = choices[id];
					return (
						<Choice
							attributes={attributes}
							setAttributes={setAttributes}
							id={id}
							key={product.id}
							choice={product}
						/>
					);
				})}
				<ce-form-row>
					<div>
						<CeButton type="primary" onClick={() => setOpen(true)}>
							{__('Add Product', 'surecart')}
						</CeButton>
						<CeButton onClick={() => setOpen(true)}>
							{__('Create Product', 'surecart')}
						</CeButton>
					</div>
				</ce-form-row>
			</CeFormSection>
			<CeFormSection>
				<CeRadioGroup label={'Product Options'}>
					<CeRadio value="all">
						Customer must purchase all products
					</CeRadio>
					<CeRadio value="radio">
						Customer must select one price from the options.
					</CeRadio>
					<CeRadio value="checkbox">
						Customer can select multiple prices.
					</CeRadio>
				</CeRadioGroup>
			</CeFormSection>
			{open && (
				<SelectProduct
					attributes={attributes}
					setAttributes={setAttributes}
					onRequestClose={() => setOpen(false)}
				/>
			)}
		</div>
	);
};
