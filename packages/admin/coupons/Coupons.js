/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton } from '@surecart/components-react';
import { useDispatch } from '@wordpress/data';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';

import ErrorFlash from '../components/ErrorFlash';
// hocs
import useCurrentPage from '../mixins/useCurrentPage';
import useEntities from '../mixins/useEntities';
import { store as dataStore } from '../store/data';
import { store as uiStore } from '../store/ui';
import Logo from '../templates/Logo';
import Template from '../templates/SingleModel';
import Codes from './modules/Codes';
import Limits from './modules/Limits';
// modules
import Name from './modules/Name';
import Types from './modules/Types';
// parts
import Sidebar from './Sidebar';

export default () => {
	const { saveModel, saveDraft, clearDrafts } = useDispatch(dataStore);
	const { addSnackbarNotice, addModelErrors } = useDispatch(uiStore);
	const {
		id,
		coupon,
		updateCoupon,
		saveCoupon,
		deleteCoupon,
		saving,
		setSaving,
		isSaving,
		fetchCoupon,
		couponErrors,
		clearCouponErrors,
		isLoading,
	} = useCurrentPage('coupon');
	const { promotions, draftPromotions } = useEntities('promotion');

	// fetch product on load.
	useEffect(() => {
		if (id) {
			fetchCoupon({
				query: {
					context: 'edit',
					expand: ['promotions'],
				},
			});
		}
	}, []);

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
		return coupon?.id
			? __('Edit Coupon', 'surecart')
			: __('New Coupon', 'surecart');
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			setSaving(true);
			id ? await updatePage() : await createPage();
			addSnackbarNotice({
				content: __('Saved.'),
			});
		} catch (e) {
			console.error(e);
		} finally {
			setSaving(false);
		}
	};

	/**
	 * Create the page and clear all drafts.
	 */
	const createPage = async () => {
		try {
			const saved = await saveCoupon({
				query: {
					context: 'edit',
					expand: ['promotions'],
				},
				data: {
					promotions: draftPromotions,
				},
			});
			if (saved?.id) {
				await clearDrafts('coupon');
				return await clearDrafts('promotion');
			}
		} catch (e) {
			throw e;
		}
	};

	/**
	 * Update product, prices and drafts all at once.
	 */
	const updatePage = async () => {
		return Promise.all([
			saveCoupon(),
			savePromotions(),
			saveDraftPromotions(),
		]);
	};

	const saveDraftPromotions = async () => {
		try {
			await Promise.all(
				(draftPromotions || []).map((promotion, index) =>
					saveDraftPromotion(promotion, index)
				)
			);
			return await clearDrafts('promotion');
		} catch (e) {
			throw e;
		}
	};

	const savePromotions = async () => {
		return await Promise.all(
			(promotions || []).map((promotion) => savePromotion(promotion))
		);
	};

	// save price
	const savePromotion = async (promotion, coupon) => {
		try {
			return await saveModel('promotion', promotion?.id);
		} catch (e) {
			addModelErrors('promotion', e);
			throw e;
		}
	};

	/** Save any draft prices. */
	const saveDraftPromotion = async (_, index) => {
		try {
			return await saveDraft('promotion', index);
		} catch (e) {
			addModelErrors('promotion', e);
			throw e;
		}
	};

	// delete promotion
	const onDelete = async () => {
		try {
			const r = confirm(
				__(
					'Are you sure you want to delete this Coupon code?',
					'surecart'
				)
			);
			if (!r) return;
			setSaving(true);
			await deleteCoupon();
		} finally {
			setSaving(false);
		}
	};

	return (
		<Template
			onSubmit={onSubmit}
			pageModelName={'coupon'}
			backUrl={'admin.php?page=sc-coupons'}
			backText={__('Back to All Coupons', 'surecart')}
			title={
				<sc-breadcrumbs>
					<sc-breadcrumb>
						<Logo display="block" />
					</sc-breadcrumb>
					<sc-breadcrumb href="admin.php?page=sc-coupons">
						{__('Coupons', 'surecart')}
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
						{/* <ActionsDropdown coupon={coupon} onDelete={onDelete} /> */}
						<ScButton
							class="sc-save-model"
							type="primary"
							loading={saving || isSaving}
							submit
						>
							{coupon?.id
								? __('Update Coupon', 'surecart')
								: __('Create Coupon', 'surecart')}
						</ScButton>
					</div>
				)
			}
			sidebar={
				<Sidebar
					coupon={coupon}
					updateCoupon={updateCoupon}
					loading={isLoading}
					saveCoupon={saveCoupon}
				/>
			}
		>
			<Fragment>
				<ErrorFlash errors={couponErrors} onHide={clearCouponErrors} />

				<Name
					loading={isLoading}
					coupon={coupon}
					updateCoupon={updateCoupon}
				/>

				<Codes id={coupon?.id || id} loading={isLoading} />

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
