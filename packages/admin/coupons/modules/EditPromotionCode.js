/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScFlex,
	ScForm,
	ScInput,
	ScSwitch,
} from '@surecart/components-react';
import { Modal } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { _n, __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { useRef, useEffect, useState } from 'react';
import Error from '../../components/Error';
import SelectCustomer from './SelectCustomer';

export default ({ onRequestClose, couponId, promotion: existingPromotion }) => {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { saveEntityRecord } = useDispatch(coreStore);
	const [promotion, setPromotion] = useState(
		existingPromotion || { max_redemptions: null }
	);
	const updatePromotion = (data) =>
		setPromotion({ ...(promotion || {}), ...data });
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const input = useRef(null);

	const createPromotion = async () => {
		try {
			setBusy(true);
			await saveEntityRecord(
				'surecart',
				'promotion',
				{
					...promotion,
					coupon: couponId,
				},
				{ throwOnError: true }
			);
			createSuccessNotice(
				promotion?.id
					? __('Promotion updated.', 'surecart')
					: __('Promotion created.', 'surecart'),
				{
					type: 'snackbar',
				}
			);
			onRequestClose();
		} catch (e) {
			console.error(e);
			setError(e);
		} finally {
			setBusy(false);
		}
	};

	useEffect(() => {
		setTimeout(() => {
			input.current.triggerFocus();
		}, 50);
	}, []);

	return (
		<Modal
			title={
				existingPromotion
					? __('Edit Promotion Code', 'surecart')
					: __('New Promotion Code', 'surecart')
			}
			css={css`
				max-width: 500px !important;
				width: 100%;
				.components-modal__content {
					overflow: visible !important;
				}
			`}
			onRequestClose={onRequestClose}
			shouldCloseOnClickOutside={false}
		>
			<ScForm
				onScSubmit={createPromotion}
				css={css`
					margin-top: 5px;
					--sc-form-row-spacing: var(--sc-spacing-large);
				`}
			>
				<Error error={error} setError={setError} />

				<ScInput
					label={__('Code', 'surecart')}
					css={css`
						flex: 1;
					`}
					help={__(
						'Leave this blank and we will generate one for you.',
						'surecart'
					)}
					attribute="code"
					value={promotion?.code}
					onScInput={(e) => updatePromotion({ code: e.target.value })}
					autofocus
					ref={input}
				/>

				<SelectCustomer
					promotion={promotion}
					updatePromotion={updatePromotion}
				/>

				<ScSwitch
					checked={promotion?.max_redemptions !== null}
					onScChange={(e) =>
						updatePromotion({
							max_redemptions: e.target.checked ? 1 : null,
						})
					}
				>
					{__('Limit the usage of this coupon code', 'surecart')}
				</ScSwitch>

				{promotion?.max_redemptions !== null && (
					<ScInput
						css={css`
							flex: 1;
						`}
						label={__('Usage Limit', 'surecart')}
						help={__(
							'Limit the number of times this code can be redeemed.',
							'surecart'
						)}
						value={promotion?.max_redemptions}
						onScInput={(e) => {
							updatePromotion({
								max_redemptions: e.target.value || 0,
							});
						}}
						type="number"
						min="1"
						required
					>
						{promotion?.max_redemptions !== null && (
							<span slot="suffix">
								{_n(
									'time',
									'times',
									parseInt(promotion?.max_redemptions),
									'surecart'
								)}
							</span>
						)}
					</ScInput>
				)}

				<ScFlex alignItems="center" justifyContent="flex-start">
					<ScButton type="primary" submit busy={busy}>
						{existingPromotion
							? __('Update', 'surecart')
							: __('Create', 'surecart')}
					</ScButton>
					<ScButton type="text" onClick={onRequestClose}>
						{__('Cancel', 'surecart')}
					</ScButton>
				</ScFlex>
				{!!busy && <ScBlockUi spinner />}
			</ScForm>
		</Modal>
	);
};
