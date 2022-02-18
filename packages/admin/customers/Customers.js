/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { dispatch } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import FlashError from '../components/FlashError';
import SaveButton from '../components/SaveButton';
// hooks
import useSnackbar from '../hooks/useSnackbar';
import Template from '../templates/SingleModel';
import useCustomerData from './hooks/useCustomerData';
import Purchases from './modules/Purchases';
import Charges from './modules/Charges';
import Details from './modules/Details';
import Orders from './modules/Orders';
import Subscriptions from './modules/Subscriptions';
// parts
import Sidebar from './Sidebar';
import useCurrentPage from '../mixins/useCurrentPage';
import { useEffect } from 'react';

export default () => {
	const {
		id,
		customer,
		fetchCustomer,
		updateCustomer,
		saveCustomer,
		isLoading,
	} = useCurrentPage('customer');

	useEffect(() => {
		if (id) {
			fetchCustomer({
				query: {
					context: 'edit',
				},
			});
		}
	}, []);

	const onSubmit = async (e) => {
		e.preventDefault();
		saveCustomer();
	};

	const title = () => {
		if (isLoading) {
			return (
				<ce-skeleton
					style={{
						width: '120px',
						display: 'inline-block',
					}}
				></ce-skeleton>
			);
		}

		return id
			? __('Edit Customer', 'checkout_engine')
			: __('Add Customer', 'checkout_engine');
	};

	return (
		<Template
			pageModelName={'customers'}
			onSubmit={onSubmit}
			backUrl={'admin.php?page=ce-customers'}
			backText={__('Back to All Customers', 'checkout_engine')}
			title={title()}
			button={
				isLoading ? (
					<ce-skeleton
						style={{
							width: '120px',
							height: '35px',
							display: 'inline-block',
						}}
					></ce-skeleton>
				) : (
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						<SaveButton>
							{id
								? __('Update Customer', 'checkout_engine')
								: __('Create Customer', 'checkout_engine')}
						</SaveButton>
					</div>
				)
			}
			sidebar={<Sidebar id={id} />}
		>
			<Fragment>
				<FlashError path="customers" scrollIntoView />
				<Details
					customer={customer}
					updateCustomer={updateCustomer}
					loading={isLoading}
				/>
				{id && <Orders id={id} />}
				{id && <Charges id={id} />}
				{id && <Subscriptions id={id} />}
			</Fragment>
		</Template>
	);
};
