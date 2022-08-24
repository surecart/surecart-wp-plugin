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
import SelectReduxProduct from '../../components/SelectReduxProduct';
import { useDispatch } from '@wordpress/data';

export default ({ id }) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [product, setProduct] = useState(false);
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const { saveEntityRecord } = useDispatch(coreStore);

	const onSubmit = async (e) => {
		e.preventDefault();
		e.stopImmediatePropagation();
		try {
			setLoading(true);
			await saveEntityRecord(
				'surecart',
				'product',
				{
					id: product,
					product_group: id,
				},
				{ throwOnError: true }
			);
			createSuccessNotice(__('Product added.', 'surecart'), {
				type: 'snackbar',
			});
			setOpen(false);
			setProduct(null);
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
				{__('Add Product', 'surecart')}
			</ScButton>
			<ScDialog
				label={__('Choose a product', 'surecart')}
				open={open}
				style={{ '--dialog-body-overflow': 'visible' }}
				onScRequestClose={() => setOpen(false)}
			>
				<ScForm onScFormSubmit={onSubmit}>
					<SelectReduxProduct
						required
						value={product}
						onSelect={setProduct}
						label={__('Select a product', 'surecart')}
					/>
					<ScButton type="primary" submit>
						{__('Add Product', 'surecart')}
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
