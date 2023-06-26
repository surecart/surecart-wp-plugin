import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScForm,
	ScIcon,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect, select } from '@wordpress/data';
import PriceSelector from '@admin/components/PriceSelector';

export default ({ checkout }) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [priceID, setPriceID] = useState(false);
	const { saveEntityRecord, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);

	const onSubmit = async (e) => {
		e.preventDefault();
		e.stopImmediatePropagation();

		try {
			setLoading(true);
			await saveEntityRecord('surecart', 'line_item', {
				checkout: checkout?.id,
				price: priceID,
				quantity: 1,
			});
			invalidateResolutionForStore();
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
						ad_hoc={false}
						onSelect={(price) => setPriceID(price)}
						requestQuery={{
							archived: false,
						}}
					/>
					<ScButton type="primary" submit>
						{__('Add Price', 'surecart')}
					</ScButton>
					<ScButton type="text" onClick={() => setOpen(false)}>
						{__('Cancel', 'surecart')}
					</ScButton>
					{loading && <ScBlockUi spinner />}
				</ScForm>
			</ScDialog>
		</>
	);
};
