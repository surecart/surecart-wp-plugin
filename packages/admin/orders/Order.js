/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { store } from './store';
import Sidebar from './Sidebar';
import SaveButton from '../components/SaveButton';
import FlashError from '../components/FlashError';

// template
import Template from '../templates/SingleModel';

import Details from './modules/Details';

import useSnackbar from '../hooks/useSnackbar';
import useOrderData from './hooks/useOrderData';
import LineItems from './modules/LineItems';
import Charges from './modules/Charges';
import Subscriptions from './modules/Subscriptions';

export default () => {
	const { snackbarNotices, removeSnackbarNotice } = useSnackbar();
	const { order, loading } = useOrderData();

	const onSubmit = async (e) => {
		e.preventDefault();
		dispatch(store).save();
	};

	const onInvalid = () => {
		dispatch(uiStore).setInvalid(true);
	};

	return (
		<Template
			status={status}
			pageModelName={'orders'}
			onSubmit={onSubmit}
			onInvalid={onInvalid}
			backUrl={'admin.php?page=ce-orders'}
			backText={__('Back to All Orders', 'checkout_engine')}
			title={
				order?.id
					? __('Edit Order', 'checkout_engine')
					: __('Create Order', 'checkout_engine')
			}
			button={
				loading ? (
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
						{/* <ProductActionsDropdown
          setConfirm={ setConfirm }
          product={ product }
          isSaving={ isSaving }
          toggleArchive={ toggleArchive }
        /> */}
						<SaveButton>
							{order?.id
								? __('Update Order', 'checkout_engine')
								: __('Create Product', 'checkout_engine')}
						</SaveButton>
					</div>
				)
			}
			notices={snackbarNotices}
			removeNotice={removeSnackbarNotice}
			sidebar={<Sidebar />}
		>
			<Fragment>
				<FlashError path="orders" scrollIntoView />
				<Details />
				<LineItems />
				<Charges />
				<Subscriptions />
			</Fragment>
		</Template>
	);
};
