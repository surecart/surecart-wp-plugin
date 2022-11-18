/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBreadcrumb,
	ScBreadcrumbs,
	ScButton,
} from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';

import Error from '../components/Error';

// hocs
import Logo from '../templates/Logo';
import Template from '../templates/SingleModel';
import Codes from './modules/Codes';
import Limits from './modules/Limits';
import Conditions from './modules/Conditions';

// modules
import Name from './modules/Name';
import Types from './modules/Types';
// parts
import Sidebar from './Sidebar';
import useSave from '../settings/UseSave';
import { useState } from 'react';
import SaveButton from '../templates/SaveButton';

export default ({ id }) => {
	const { save } = useSave();
	const [error, setError] = useState(null);
	const { editEntityRecord } = useDispatch(coreStore);

	const { coupon, isLoading } = useSelect((select) => {
		const entityData = ['surecart', 'coupon', id];

		return {
			coupon: select(coreStore).getEditedEntityRecord(...entityData),
			isLoading: select(coreStore)?.isResolving?.(
				'getEditedEntityRecord',
				[...entityData]
			),
			loadError: select(coreStore)?.getResolutionError?.(
				'getEditedEntityRecord',
				...entityData
			),
		};
	});

	const updateCoupon = (data) =>
		editEntityRecord('surecart', 'coupon', id, data);

	/**
	 * Handle the form submission
	 */
	const onSubmit = async () => {
		try {
			setError(null);
			save({ successMessage: __('Coupon updated.', 'surecart') });
		} catch (e) {
			setError(e);
		}
	};

	return (
		<Template
			onSubmit={onSubmit}
			pageModelName={'coupon'}
			backUrl={'admin.php?page=sc-coupons'}
			backText={__('Back to All Coupons', 'surecart')}
			title={
				<ScBreadcrumbs>
					<ScBreadcrumb>
						<Logo display="block" />
					</ScBreadcrumb>
					<ScBreadcrumb href="admin.php?page=sc-coupons">
						{__('Coupons', 'surecart')}
					</ScBreadcrumb>
					<ScBreadcrumb>{__('Edit Coupon', 'surecart')}</ScBreadcrumb>
				</ScBreadcrumbs>
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
					<SaveButton>{__('Update Coupon', 'surecart')}</SaveButton>
				)
			}
			sidebar={
				<Sidebar
					coupon={coupon}
					updateCoupon={updateCoupon}
					loading={isLoading}
				/>
			}
		>
			<Fragment>
				<Error error={error} setError={setError} margin="80px" />

				<Name
					loading={isLoading}
					coupon={coupon}
					updateCoupon={updateCoupon}
				/>

				<Codes id={coupon?.id || id} loading={isLoading} />

				<Conditions
					loading={isLoading}
					coupon={coupon}
					updateCoupon={updateCoupon}
				/>

				<Types
					loading={isLoading}
					coupon={coupon}
					updateCoupon={updateCoupon}
				/>

				<Limits
					loading={isLoading}
					coupon={coupon}
					updateCoupon={updateCoupon}
				/>
			</Fragment>
		</Template>
	);
};
