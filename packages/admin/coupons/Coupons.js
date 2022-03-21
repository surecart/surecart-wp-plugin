/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';

import { store as uiStore } from '../store/ui';
import { store as dataStore } from '../store/data';

import Template from '../templates/SingleModel';
import SaveButton from './components/SaveButton';

// modules
import Name from './modules/Name';
import Codes from './modules/Codes';
import Types from './modules/Types';
import Limits from './modules/Limits';

// parts
import Sidebar from './Sidebar';

// hocs
import withConfirm from '../hocs/withConfirm';
import { useEffect } from 'react';
import ErrorFlash from '../components/ErrorFlash';
import useCurrentPage from '../mixins/useCurrentPage';
import useEntities from '../mixins/useEntities';
import { useDispatch } from '@wordpress/data';
import { CeButton } from '@surecart/components-react';

export default () => {
	const { saveModel, saveDraft, clearDrafts } = useDispatch(dataStore);
	const { addSnackbarNotice, addModelErrors } = useDispatch(uiStore);
	const {
		id,
		coupon,
		updateCoupon,
		saveCoupon,
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
				<ce-skeleton
					style={{
						width: '120px',
						display: 'inline-block',
					}}
				></ce-skeleton>
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

	return (
		<Template
			onSubmit={onSubmit}
			pageModelName={'coupon'}
			backUrl={'admin.php?page=ce-coupons'}
			backText={__('Back to All Coupons', 'surecart')}
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
						<CeButton
							type="primary"
							loading={saving || isSaving}
							submit
						>
							{coupon?.id
								? __('Update Coupon', 'surecart')
								: __('Create Coupon', 'surecart')}
						</CeButton>
					</div>
				)
			}
			sidebar={
				<Sidebar
					coupon={coupon}
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
