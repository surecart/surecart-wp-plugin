/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton } from '@surecart/components-react';
import { useDispatch } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';

import FlashError from '../components/FlashError';
import useCurrentPage from '../mixins/useCurrentPage';
import { store as uiStore } from '../store/ui';
import Logo from '../templates/Logo';
// hooks
import Template from '../templates/SingleModel';
import Charges from './modules/Charges';
import Details from './modules/Details';
import Orders from './modules/Orders';
import Subscriptions from './modules/Subscriptions';
// parts
import Sidebar from './Sidebar';

export default () => {
	const {
		id,
		customer,
		fetchCustomer,
		updateCustomer,
		saveCustomer,
		setSaving,
		isSaving,
		isLoading,
	} = useCurrentPage('customer');

	const { addSnackbarNotice, addModelErrors } = useDispatch(uiStore);
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
		try {
			setSaving(true);
			await saveCustomer();
			addSnackbarNotice({
				content: __('Saved.'),
			});
		} catch (e) {
			console.error(e);
			addModelErrors('customer', e);
		} finally {
			setSaving(false);
		}
	};

	const title = () => {
		if (isLoading) {
			return (
				<sc-skeleton
					style={{
						width: '120px',
						display: 'inline-block',
					}}
				></sc-skeleton>
			);
		}

		return id
			? __('Edit Customer', 'surecart')
			: __('Add Customer', 'surecart');
	};

	return (
		<Template
			pageModelName={'customers'}
			onSubmit={onSubmit}
			backUrl={'admin.php?page=sc-customers'}
			backText={__('Back to All Customers', 'surecart')}
			title={
				<sc-breadcrumbs>
					<sc-breadcrumb>
						<Logo display="block" />
					</sc-breadcrumb>
					<sc-breadcrumb href="admin.php?page=sc-customers">
						{__('Customers', 'surecart')}
					</sc-breadcrumb>
					<sc-breadcrumb>
						<sc-flex style={{ gap: '1em' }}>{title()}</sc-flex>
					</sc-breadcrumb>
				</sc-breadcrumbs>
			}
			button={
				isLoading ? (
					<sc-skeleton
						style={{
							width: '120px',
							height: '35px',
							display: 'inline-block',
						}}
					></sc-skeleton>
				) : (
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: 0.5em;
						`}
					>
						<ScButton type="primary" loading={isSaving} submit>
							{id
								? __('Update Customer', 'surecart')
								: __('Create Customer', 'surecart')}
						</ScButton>
					</div>
				)
			}
			sidebar={
				<Sidebar
					id={id}
					customer={customer}
					updateCustomer={updateCustomer}
					loading={isLoading}
				/>
			}
		>
			<Fragment>
				<FlashError path="customers" scrollIntoView />
				<Details
					customer={customer}
					updateCustomer={updateCustomer}
					loading={isLoading}
				/>
				{!!id && <Orders id={id} />}
				{!!id && <Charges id={id} />}
				{!!id && <Subscriptions id={id} />}
			</Fragment>
		</Template>
	);
};
