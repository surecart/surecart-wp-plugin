import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScForm,
	ScIcon,
	ScPriceInput,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useDispatch, select, useSelect } from '@wordpress/data';
import expand from '../query';
import PriceSelector from '@admin/components/PriceSelector';

export default ({ checkout }) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [priceID, setPriceID] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const { price, priceLoading } = useSelect(
		(select) => {
			// we don't yet have a price id.
			if (!priceID) {
				return {};
			}
			// our entity query data.
			const entityData = ['surecart', 'price', priceID];

			const price = select(coreStore).getEditedEntityRecord(
				...entityData
			);
			const priceLoading = !select(coreStore)?.hasFinishedResolution?.(
				'getEditedEntityRecord',
				[...entityData]
			);

			return {
				price,
				priceLoading,
			};
		},
		[priceID]
	);

	const [addHocAmount, setAddHocAmount] = useState(price?.amount);

	const onSubmit = async (e) => {
		e.preventDefault();
		e.stopImmediatePropagation();

		try {
			setLoading(true);

			// get the line items endpoint.
			const { baseURL } = select(coreStore).getEntityConfig(
				'surecart',
				'line_item'
			);

			// add the line item.
			const { checkout: data } = await apiFetch({
				method: 'POST',
				path: addQueryArgs(baseURL, {
					expand: [
						// expand the checkout and the checkout's required expands.
						...(expand || []).map((item) => {
							return item.includes('.')
								? item
								: `checkout.${item}`;
						}),
						'checkout',
					],
				}),
				data: {
					checkout: checkout?.id,
					price: priceID,
					quantity: 1,
					ad_hoc_amount: addHocAmount,
				},
			});

			// update the checkout in the redux store.
			receiveEntityRecords(
				'surecart',
				'draft-checkout',
				data,
				undefined,
				false,
				checkout
			);

			createSuccessNotice(__('Product added.', 'surecart'), {
				type: 'snackbar',
			});

			setOpen(false);
		} catch (e) {
			console.error(e);
			createErrorNotice(
				e?.message || __('Something went wrong.', 'surecart'),
				{
					type: 'snackbar',
				}
			);
		} finally {
			setAddHocAmount(null);
			setLoading(false);
		}
	};

	return (
		<>
			<ScButton type="primary" onClick={() => setOpen(true)}>
				<ScIcon name="plus" slot="prefix" />
				{__('Add Price', 'surecart')}
			</ScButton>
			<ScDialog
				label={__('Choose a price', 'surecart')}
				open={open}
				style={{ '--dialog-body-overflow': 'visible' }}
				onScRequestClose={() => setOpen(false)}
			>
				<ScForm onScFormSubmit={onSubmit}>
					<PriceSelector
						required
						value={priceID}
						ad_hoc={true}
						onSelect={(price) => setPriceID(price)}
						requestQuery={{
							archived: false,
						}}
					/>
					{price?.ad_hoc && (
						<ScPriceInput
							label={__('Amount', 'surecart')}
							placeholder={__('Enter an Amount', 'surecart')}
							style={{ flex: 1 }}
							currencyCode={price?.currency}
							value={addHocAmount || price?.amount || null}
							onScInput={(e) => {
								setAddHocAmount(e.target.value);
							}}
						/>
					)}
					<ScButton type="primary" submit>
						{__('Add Price', 'surecart')}
					</ScButton>
					<ScButton type="text" onClick={() => setOpen(false)}>
						{__('Cancel', 'surecart')}
					</ScButton>
					{(!!loading || !!priceLoading) && <ScBlockUi spinner />}
				</ScForm>
			</ScDialog>
		</>
	);
};
