import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import Price from './Price';
import NewPrice from './NewPrice';
import {
	ScBlockUi,
	ScCard,
	ScEmpty,
	ScFlex,
	ScStackedList,
	ScStackedListRow,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch, select } from '@wordpress/data';
import expand from '../query';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState } from 'react';

export default ({ checkout, loading, busy }) => {
	const line_items = checkout?.line_items?.data || [];
	const [deleting, setDeleting] = useState(false);
	const { createErrorNotice } = useDispatch(noticesStore);
	const { deleteEntityRecord, receiveEntityRecords } = useDispatch(coreStore);

	const onRemove = async (id) => {
		try {
			setDeleting(true);

			// delete the entity record.
			await deleteEntityRecord('surecart', 'line_item', id, null, {
				throwOnError: true,
			});

			// get the checkouts endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'checkout'
			);

			// fetch the updated checkout.
			const data = await apiFetch({
				path: addQueryArgs(`${baseURL}/${checkout?.id}`, {
					expand,
				}),
			});

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'checkout',
				data,
				undefined,
				false,
				checkout
			);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setDeleting(false);
		}
	};

	const renderPrices = () => {
		if (!line_items?.length) {
			return (
				<ScEmpty icon="shopping-bag">
					{__('Add some prices to this order.', 'surecart')}
				</ScEmpty>
			);
		}

		return (
			<ScCard noPadding>
				<ScStackedList>
					<ScStackedListRow
						style={{
							'--columns': '3',
						}}
					>
						<ScFlex alignItems="center" justifyContent="flex-start">
							<div>{__('Product', 'surecart')}</div>
						</ScFlex>
						<div
							style={{
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							{__('Quantity', 'surecart')}
						</div>
					</ScStackedListRow>
					{(line_items || []).map(({ id, price }) => (
						<Price
							key={id}
							price={price}
							onRemove={() => onRemove(id)}
						/>
					))}
				</ScStackedList>
			</ScCard>
		);
	};

	return (
		<Box
			title={__('Add Prices', 'surecart')}
			loading={loading}
			footer={<NewPrice checkout={checkout} />}
		>
			{renderPrices()}
			{(!!busy || !!deleting) && <ScBlockUi spinner />}
		</Box>
	);
};
