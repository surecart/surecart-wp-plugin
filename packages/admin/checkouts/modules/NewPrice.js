import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScForm,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useDispatch, select } from '@wordpress/data';
import expand from '../query';
import PriceSelector from '@admin/components/PriceSelector';
import Error from '../../components/Error';

export default ({ checkout, open, onRequestClose }) => {
	const [loading, setLoading] = useState(false);
	const [priceID, setPriceID] = useState(false);
	const { receiveEntityRecords } = useDispatch(coreStore);
	const [error, setError] = useState(false);

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
			setPriceID(false);
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScDialog
			label={__('Choose a price', 'surecart')}
			open={open}
			style={{ '--dialog-body-overflow': 'visible' }}
			onScRequestClose={onRequestClose}
		>
			<ScForm onScFormSubmit={onSubmit}>
				<Error error={error} setError={setError} />
				<PriceSelector
					required
					value={priceID}
					ad_hoc={true}
					onSelect={(price) => setPriceID(price)}
					requestQuery={{
						archived: false,
					}}
				/>

				<ScButton type="primary" submit>
					{__('Add Price', 'surecart')}
				</ScButton>

				<ScButton type="text" onClick={onRequestClose}>
					{__('Cancel', 'surecart')}
				</ScButton>

				{!!loading && <ScBlockUi spinner />}
			</ScForm>
		</ScDialog>
	);
};
