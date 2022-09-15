import {
	ScButton,
	ScFormControl,
	ScIcon,
	ScSelect,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import Box from '../../ui/Box';
import PriceFilters from './filters/price/PriceFilters';
import NewCondition from './NewCondition';

export default ({ loading, bump, updateBump }) => {
	const [newDialog, setNewDialog] = useState(false);
	return (
		<Box
			title={__('Display Conditions', 'surecart')}
			loading={loading}
			footer={
				<ScButton onClick={() => setNewDialog(true)}>
					<ScIcon name="plus" slot="prefix" />
					{__('Add A Condition', 'surecart')}
				</ScButton>
			}
		>
			<ScSelect
				label={__('Show Bump Offer If', 'surecart')}
				value={bump?.filter_match_type}
				choices={[
					{
						label: __(
							'All of these items are in the cart.',
							'surecart'
						),
						value: 'all',
					},
					{
						label: __(
							'Any of these items are in the cart.',
							'surecart'
						),
						value: 'any',
					},
					{
						label: __(
							'None of these items are in the cart.',
							'surecart'
						),
						value: 'none',
					},
				]}
				onScChange={(e) =>
					updateBump({ filter_match_type: e.target.value })
				}
			/>

			<PriceFilters bump={bump} />

			{/* <div>
				<ScButton onClick={() => setNewDialog(true)}>
					<ScIcon name="plus" slot="prefix" />
					{__('Add A Condition', 'surecart')}
				</ScButton>
			</div> */}

			{newDialog && (
				<NewCondition
					bump={bump}
					updateBump={updateBump}
					onRequestClose={() => setNewDialog(false)}
				/>
			)}
		</Box>
	);
};
