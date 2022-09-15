import {
	ScCard,
	ScFormControl,
	ScStackedList,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import PriceFilter from './PriceFilter';

export default ({ bump }) => {
	if (!bump?.filters?.price_ids?.length) {
		return null;
	}

	return (
		<ScFormControl label={__('Prices', 'surecart')}>
			<ScCard noPadding>
				<ScStackedList>
					{(bump?.filters?.price_ids || []).map((id) => (
						<PriceFilter id={id} key={id} />
					))}
				</ScStackedList>
			</ScCard>
		</ScFormControl>
	);
};
