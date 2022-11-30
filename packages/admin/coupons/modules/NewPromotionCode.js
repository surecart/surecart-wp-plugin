/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScFlex,
	ScForm,
	ScInput,
} from '@surecart/components-react';
import { Modal } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
import { useRef, useEffect, useState } from 'react';
import Error from '../../components/Error';

export default ({ onRequestClose, couponId }) => {
	const { createErrorNotice, createSuccessNotice } =
		useDispatch(noticesStore);
	const { saveEntityRecord } = useDispatch(coreStore);
	const [code, setCode] = useState(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(null);
	const input = useRef(null);

	const createPromotion = async () => {
		try {
			setBusy(true);
			await saveEntityRecord(
				'surecart',
				'promotion',
				{ code, coupon: couponId },
				{ throwOnError: true }
			);
			createSuccessNotice(__('Promotion created.', 'surecart'), {
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
			title={__('New Promotion Code', 'surecart')}
			css={css`
				max-width: 500px !important;
			`}
			onRequestClose={onRequestClose}
			shouldCloseOnClickOutside={false}
		>
			<ScForm
				onScSubmit={createPromotion}
				css={css`
					margin-top: 5px;
				`}
			>
				<Error error={error} setError={setError} />
				<ScInput
					css={css`
						flex: 1;
					`}
					help={__(
						'Customers will enter this discount code at checkout. Leave this blank and we will generate one for you.',
						'surecart'
					)}
					attribute="code"
					value={code}
					onScInput={(e) => setCode(e.target.value)}
					autofocus
					ref={input}
				/>
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
