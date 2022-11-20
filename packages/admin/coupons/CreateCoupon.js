/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useState } from 'react';

import { ScAlert, ScButton, ScForm, ScInput } from '@surecart/components-react';
import CreateTemplate from '../templates/CreateModel';
import Box from '../ui/Box';
import Restrictions from './modules/Restrictions';
import Types from './modules/Types';
import Limits from './modules/Limits';

export default ({ id, setId }) => {
	const [isSaving, setIsSaving] = useState(false);
	const [name, setName] = useState('');
	const [promotion, setPromotion] = useState(null);
	const [coupon, setCoupon] = useState(null);
	const [error, setError] = useState('');
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { saveEntityRecord } = useDispatch(coreStore);

	const updatePromotion = (data) => {
		setPromotion({
			...(promotion || {}),
			...data,
		});
	};

	const updateCoupon = (data) => {
		setCoupon({
			...(coupon || {}),
			...data,
		});
	};

	// create the product.
	const onSubmit = async (e) => {
		e.preventDefault();
		console.log({ coupon });
		try {
			setIsSaving(true);
			const response = await saveEntityRecord(
				'surecart',
				'coupon',
				{
					...coupon,
					promotions: [
						{
							archived: false,
							code: promotion?.code,
						},
					],
				},
				{ throwOnError: true }
			);
			setId(response.id);
			createSuccessNotice(__('Coupon created.', 'surecart'), {
				type: 'snackbar',
			});
		} catch (e) {
			console.error(e);
			setError(e?.message || __('Something went wrong.', 'surecart'));
			setIsSaving(false);
		}
	};

	return (
		<CreateTemplate id={id}>
			<ScAlert open={error?.length} type="danger" closable scrollOnOpen>
				<span slot="title">{error}</span>
			</ScAlert>

			<ScForm
				onScSubmit={onSubmit}
				style={{ '--sc-form-row-spacing': '3em' }}
			>
				<Box title={__('Create New Coupon', 'surecart')}>
					<div
						css={css`
							display: grid;
							gap: var(--sc-spacing-large);
						`}
					>
						<ScInput
							label={__('Coupon Name', 'surecart')}
							help={__(
								'This is an internal name for your coupon. This is not visible to customers.',
								'surecart'
							)}
							onScChange={(e) =>
								updateCoupon({ name: e.target.value })
							}
							value={coupon?.name}
							name="name"
							required
							autofocus
						/>

						<ScInput
							label={__('Promotion Code', 'surecart')}
							className="sc-promotion-code"
							css={css`
								flex: 1;
							`}
							help={__(
								'Customers will enter this discount code at checkout. Leave this blank and we will generate one for you.',
								'surecart'
							)}
							attribute="name"
							value={promotion?.code}
							onScChange={(e) =>
								updatePromotion({ code: e.target.value })
							}
						/>
					</div>
				</Box>

				<Types coupon={coupon} updateCoupon={updateCoupon} />

				<Limits coupon={coupon} updateCoupon={updateCoupon} />

				<Restrictions coupon={coupon} updateCoupon={updateCoupon} />

				<div css={css`display: flex gap: var(--sc-spacing-small);`}>
					<ScButton type="primary" submit loading={isSaving}>
						{__('Create Coupon', 'surecart')}
					</ScButton>
					<ScButton href={'admin.php?page=sc-coupons'} type="text">
						{__('Cancel', 'surecart')}
					</ScButton>
				</div>
			</ScForm>
		</CreateTemplate>
	);
};
