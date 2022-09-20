import {
	ScButton,
	ScEmpty,
	ScIcon,
	ScSelect,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import Box from '../../ui/Box';
import Filters from './filters/Filters';
import NewCondition from './NewCondition';

export default ({ loading, bump, updateBump }) => {
	const [newDialog, setNewDialog] = useState(false);

	const hasConditions = Object.keys(bump.filters || {}).some((key) => {
		return bump.filters[key]?.length;
	});

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
			{hasConditions ? (
				<>
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
					<Filters
						label={__('Prices', 'surecart')}
						type="price_ids"
						bump={bump}
						updateBump={updateBump}
					/>
					<Filters
						label={__('Products', 'surecart')}
						type="product_ids"
						bump={bump}
						updateBump={updateBump}
					/>
					<Filters
						label={__('Upgrade Groups', 'surecart')}
						type="product_group_ids"
						bump={bump}
						updateBump={updateBump}
					/>
				</>
			) : (
				<ScEmpty icon="zap">
					{__(
						'Add some conditions to display this bump.',
						'surecart'
					)}
				</ScEmpty>
			)}

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
