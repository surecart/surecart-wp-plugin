/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';

import { CeRadioGroup, CeRadio } from '@checkout-engine/components-react';
import PriceChoices from '@scripts/blocks/components/PriceChoices';
import PriceSelector from '../../../components/PriceSelector';
import { Fragment } from 'react';

export default ({
	template,
	choices,
	setChoices,
	choice_type,
	setChoiceType,
}) => {
	const removeChoice = (index) => {
		setChoices(choices.filter((_, i) => i !== index));
	};

	const updateChoice = (data, index) => {
		setChoices(
			choices.map((item, i) => {
				if (i !== index) return item;
				return {
					...item,
					...data,
				};
			})
		);
	};

	const addProduct = () => {
		setChoices([
			...(choices || []),
			{
				quantity: 1,
			},
		]);
	};

	const hasValidChoices = () => {
		return !!(choices || []).find((choice) => !!choice.id);
	};

	if (['donation', 'invoice'].includes(template)) {
		setChoiceType('any');
		let heading;
		switch (template) {
			case 'donation':
				heading = __('Choose A Donation Product', 'checkout_engine');
				break;
			case 'invoice':
				heading = __('Choose An Invoice Product', 'checkout_engine');
				break;
			default:
				heading = __('Choose A  Product', 'checkout_engine');
				break;
		}

		return (
			<Fragment>
				<ce-dashboard-module heading={heading}>
					<PriceSelector
						ad_hoc={true}
						open={false}
						value={choices[0]?.id}
						onSelect={(id) => {
							if (id) {
								setChoices([{ id, quantity: 1 }]);
							} else {
								setChoices([]);
							}
						}}
						required
					/>
				</ce-dashboard-module>
			</Fragment>
		);
	}

	return (
		<Fragment>
			<ce-dashboard-module heading={__('Products', 'checkout_engine')}>
				<PriceChoices
					choices={choices}
					onAddProduct={addProduct}
					onUpdate={updateChoice}
					onRemove={removeChoice}
				/>
			</ce-dashboard-module>

			{hasValidChoices() && (
				<ce-dashboard-module
					heading={__('Product Options', 'checkout_engine')}
				>
					<CeRadioGroup
						onCeChange={(e) => setChoiceType(e.target.value)}
					>
						<CeRadio value="all" checked={choice_type === 'all'}>
							{__(
								'Customer must purchase all products',
								'checkout_engine'
							)}
						</CeRadio>
						<CeRadio
							value="radio"
							checked={choice_type === 'radio'}
						>
							{__(
								'Customer must select one price from the options.',
								'checkout_engine'
							)}
						</CeRadio>
						<CeRadio
							value="checkbox"
							checked={choice_type === 'checkbox'}
						>
							{__(
								'Customer can select multiple prices.',
								'checkout_engine'
							)}
						</CeRadio>
					</CeRadioGroup>
				</ce-dashboard-module>
			)}
		</Fragment>
	);
};
