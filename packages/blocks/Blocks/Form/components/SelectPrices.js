import { __ } from '@wordpress/i18n';

import { ScRadioGroup, ScRadio } from '@surecart/components-react';
import PriceChoices from '@scripts/blocks/components/PriceChoices';
import PriceSelector from '../../../components/PriceSelector';
import { Fragment } from '@wordpress/element';
import { updateCartLineItem } from '../../../util';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import SelectModel from '../../../../admin/components/SelectModel';
import { store as coreStore } from '@wordpress/core-data';

export default ({
	template,
	choices,
	setChoices,
	choice_type,
	setChoiceType,
}) => {
	const [query, setQuery] = useState(null);
	const { products, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				{
					query,
					archived: false,
					ad_hoc: true,
					expand: ['prices'],
				},
			];
			return {
				products: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[query]
	);

	const removeChoice = (index) => {
		setChoices(choices.filter((_, i) => i !== index));
	};

	const updateChoice = (data) =>
		setChoices(updateCartLineItem(data, choices));

	const hasValidChoices = () => {
		return !!(choices || []).find((choice) => !!choice.id);
	};

	if (['donation'].includes(template)) {
		setChoiceType('any');
		let heading = __('Choose A Donation Product', 'surecart');
		return (
			<Fragment>
				<sc-dashboard-module heading={heading}>
					<SelectModel
						choices={(products || []).map((product) => ({
							label: product.name,
							value: product.id,
						}))}
						value={choices[0]?.id}
						onQuery={setQuery}
						onFetch={() => setQuery('')}
						loading={loading}
						onSelect={(product_id) => {
							if (product_id) {
								setChoices([{ id: product_id, quantity: 1 }]);
							} else {
								setChoices([]);
							}
						}}
						style={{ width: '100%' }}
						required
					/>
				</sc-dashboard-module>
			</Fragment>
		);
	}
	if (['invoice'].includes(template)) {
		setChoiceType('any');
		let heading = __('Choose An Invoice Product', 'surecart');

		return (
			<Fragment>
				<sc-dashboard-module heading={heading}>
					<PriceSelector
						ad_hoc={true}
						value={choices[0]?.id}
						variable={false}
						onSelect={({ price_id }) => {
							if (price_id) {
								setChoices([{ id: price_id, quantity: 1 }]);
							} else {
								setChoices([]);
							}
						}}
						required
					/>
				</sc-dashboard-module>
			</Fragment>
		);
	}

	return (
		<Fragment>
			<sc-dashboard-module heading={__('Products', 'surecart')}>
				<PriceChoices
					choices={choices}
					onUpdate={updateChoice}
					onRemove={removeChoice}
					variable={false}
				/>
			</sc-dashboard-module>

			{hasValidChoices() && (
				<sc-dashboard-module
					heading={__('Product Options', 'surecart')}
				>
					<ScRadioGroup
						onScChange={(e) => setChoiceType(e.target.value)}
					>
						<ScRadio value="all" checked={choice_type === 'all'}>
							{__(
								'Customer must purchase all options.',
								'surecart'
							)}
						</ScRadio>
						<ScRadio
							value="radio"
							checked={choice_type === 'radio'}
						>
							{__(
								'Customer must select one of the options.',
								'surecart'
							)}
						</ScRadio>
						<ScRadio
							value="checkbox"
							checked={choice_type === 'checkbox'}
						>
							{__(
								'Customer can select multiple options.',
								'surecart'
							)}
						</ScRadio>
					</ScRadioGroup>
				</sc-dashboard-module>
			)}
		</Fragment>
	);
};
