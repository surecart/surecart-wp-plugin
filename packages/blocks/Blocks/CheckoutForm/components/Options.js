import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
	ScButton,
	ScFormSection,
	ScSelect,
	ScRadioGroup,
	ScRadio,
} from '@surecart/components-react';
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
			<ScFormSection label="Products">
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
				<sc-form-row>
					<div>
						<ScButton type="primary" onClick={() => setOpen(true)}>
							{__('Add Product', 'surecart')}
						</ScButton>
						<ScButton onClick={() => setOpen(true)}>
							{__('Create Product', 'surecart')}
						</ScButton>
					</div>
				</sc-form-row>
			</ScFormSection>
			<ScFormSection>
				<ScRadioGroup label={'Product Options'}>
					<ScRadio value="all">
						Customer must purchase all products
					</ScRadio>
					<ScRadio value="radio">
						Customer must select one price from the options.
					</ScRadio>
					<ScRadio value="checkbox">
						Customer can select multiple prices.
					</ScRadio>
				</ScRadioGroup>
			</ScFormSection>
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
