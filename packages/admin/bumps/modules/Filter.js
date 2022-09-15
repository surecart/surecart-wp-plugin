import { ScFlex, ScSelect } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import PriceSelector from '../../components/PriceSelector';
import PriceFilter from './filters/price/PriceFilter';

export default ({ type, filter }) => {
  if ( type === 'price_id') {
    return <PriceFilter id={}
  }

	return (
		<ScFlex>
			<ScSelect
				type={type}
				style={{ width: '50%' }}
				choices={[
					{
						label: __('Price', 'surecart'),
						value: 'all',
					},
					{
						label: __('Product', 'surecart'),
						value: 'any',
					},
					{
						label: __('Upgrade Group', 'surecart'),
						value: 'none',
					},
				]}
			/>

			<PriceSelector
				style={{ width: '50%' }}
				ad_hoc={false}
				requestQuery={{
					archived: false,
				}}
			/>
		</ScFlex>
	);
};
