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
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { useRef, useEffect, useState } from 'react';
import Error from '../../components/Error';

export default ({ onRequestClose }) => {
	const { createSuccessNotice } = useDispatch(noticesStore);
	const { saveEntityRecord } = useDispatch(coreStore);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const [data, setData] = useState({
		description: __('Can you tell us a little more?', 'surecart'),
	});
	const input = useRef(null);

	const updateData = (newData) =>
		setData({
			...(data || {}),
			...newData,
		});

	const createReason = async () => {
		try {
			setBusy(true);
			await saveEntityRecord('surecart', 'cancellation_reason', data, {
				throwOnError: true,
			});
			createSuccessNotice(__('Reason created.', 'surecart'), {
				type: 'snackbar',
			});
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
			title={__('New Cancellation Reason', 'surecart')}
			css={css`
				max-width: 500px !important;
			`}
			onRequestClose={onRequestClose}
			shouldCloseOnClickOutside={false}
		>
			<ScForm
				onScSubmit={createReason}
				css={css`
					margin-top: 5px;
					--sc-form-row-spacing: var(--sc-spacing-x-large);
				`}
			>
				<Error error={error} setError={setError} />
				<ScInput
					label={__('Label', 'surecart')}
					help={__(
						'The customer-facing label for this cancellation reason.',
						'surecart'
					)}
					value={data?.label}
					onScInput={(e) => updateData({ label: e.target.value })}
					autofocus
					ref={input}
				/>

				<ScSwitch
					checked={data?.coupon_enabled}
					onScChange={(e) =>
						updateData({ coupon_enabled: e.target.checked })
					}
				>
					{__('Offer Discount', 'surecart')}
					<span slot="description">
						{__(
							'Offer the rewewal discount when this option is selected',
							'surecart'
						)}
					</span>
				</ScSwitch>

				<ScSwitch
					checked={data?.comment_enabled}
					onScChange={(e) =>
						updateData({ comment_enabled: e.target.checked })
					}
				>
					{__('Request Comments', 'surecart')}
					<span slot="description">
						{__(
							'Should the customer be prompted for additional information?',
							'surecart'
						)}
					</span>
				</ScSwitch>

				{!!data?.comment_enabled && (
					<ScInput
						label={__('Comment Prompt', 'surecart')}
						help={__(
							'The prompt that will appear when you request more information.',
							'surecart'
						)}
						value={data?.description}
						onScInput={(e) =>
							updateData({ description: e.target.value })
						}
					/>
				)}
				<ScFlex alignItems="center" justifyContent="flex-start">
					<ScButton type="primary" submit busy={busy}>
						{__('Create', 'surecart')}
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
