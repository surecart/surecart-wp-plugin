/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import FlashError from '../components/FlashError';
import { store as uiStore } from '../store/ui';
// hooks
import Template from '../templates/SingleModel';
import Charges from './modules/Charges';
import Details from './modules/Details';
import Orders from './modules/Orders';
import Subscriptions from './modules/Subscriptions';
// parts
import Sidebar from './Sidebar';
import useCurrentPage from '../mixins/useCurrentPage';
import { useEffect } from 'react';
import { CeButton } from '@checkout-engine/components-react';
import { useDispatch } from '@wordpress/data';

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
				<ce-skeleton
					style={{
						width: '120px',
						display: 'inline-block',
					}}
				></ce-skeleton>
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
			backUrl={'admin.php?page=ce-customers'}
			backText={__('Back to All Customers', 'surecart')}
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
						<CeButton type="primary" loading={isSaving} submit>
							{id
								? __('Update Customer', 'surecart')
								: __('Create Customer', 'surecart')}
						</CeButton>
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
				{id && <Orders id={id} />}
				{id && <Charges id={id} />}
				{id && <Subscriptions id={id} />}
			</Fragment>
		</Template>
	);
};
