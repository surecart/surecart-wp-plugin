import { ScBreadcrumb, ScBreadcrumbs, ScButton, ScFlex, ScIcon } from '@surecart/components-react';
import { store as dataStore } from '@surecart/data';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import useDirty from '../hooks/useDirty';
import useEntity from '../hooks/useEntity';
import Logo from '../templates/Logo';
import SaveButton from '../templates/SaveButton';
import UpdateModel from '../templates/UpdateModel';
import Balance from './modules/Balance';
import Charges from './modules/Charges';
import Details from './modules/Details';
import Notifications from './modules/Notifications';
import Orders from './modules/Orders';
import Purchases from './modules/Purchases';
import Subscriptions from './modules/Subscriptions';
import User from './modules/User';

export default () => {
	const { createSuccessNotice, createErrorNotice } =
		useDispatch(noticesStore);
	const { saveDirtyRecords } = useDirty();
	const id = useSelect((select) => select(dataStore).selectPageId());
	const {
		customer,
		editCustomer,
		hasLoadedCustomer,
		deletingCustomer,
		savingCustomer,
	} = useEntity('customer', id, { expand: ['balances'] });

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		try {
			await saveDirtyRecords();
			// save success.
			createSuccessNotice(__('Customer updated.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			createErrorNotice(
				e?.message || __('Something went wrong', 'surecart')
			);
			if (e?.additional_errors?.length) {
				e?.additional_errors.forEach((e) => {
					if (e?.message) {
						createErrorNotice(e?.message);
					}
				});
			}
		}
	};

	return (
		<UpdateModel
			onSubmit={onSubmit}
			title={
				<ScFlex style={{ gap: '1em' }} align-items="center">
					<ScButton
						circle
						size="small"
						href="admin.php?page=sc-customers"
					>
						<ScIcon name="arrow-left"></ScIcon>
					</ScButton>
					<ScBreadcrumbs>
						<ScBreadcrumb>
							<Logo display="block" />
						</ScBreadcrumb>
						<ScBreadcrumb href="admin.php?page=sc-customers">
							{__('Customers', 'surecart')}
						</ScBreadcrumb>
						<ScBreadcrumb>
							<ScFlex style={{ gap: '1em' }}>
								{__('Edit Customer', 'surecart')}
							</ScFlex>
						</ScBreadcrumb>
					</ScBreadcrumbs>
				</ScFlex>
			}
			button={
				<SaveButton
					loading={!hasLoadedCustomer}
					busy={deletingCustomer || savingCustomer}
				>
					{__('Save Customer', 'surecart')}
				</SaveButton>
			}
			sidebar={
				<>
					<Balance customer={customer} loading={!hasLoadedCustomer} />
					<Purchases customerId={id} />
					<User customer={customer} customerId={id} />
					<Notifications
						customer={customer}
						updateCustomer={editCustomer}
						loading={!hasLoadedCustomer}
					/>
				</>
			}
		>
			<Details
				customer={customer}
				updateCustomer={editCustomer}
				loading={!hasLoadedCustomer}
			/>

			<Orders customerId={id} />
			<Charges customerId={id} />
			<Subscriptions customerId={id} />

			{/* <Fragment>
				<Details
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>

				<Prices
					productId={id}
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>

				<Integrations id={id} />

				<Downloads
					id={id}
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>

				<Licensing
					id={id}
					product={product}
					updateProduct={editProduct}
					loading={!hasLoadedProduct}
				/>
			</Fragment> */}
		</UpdateModel>
	);
};
