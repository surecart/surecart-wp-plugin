/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScDialog,
	ScForm,
	ScText,
} from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { useEffect } from 'react';
import Error from '../../../../components/Error';

export default ({ purchase, open, onRequestClose }) => {
	const { receiveEntityRecords, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [confirmProps, setConfirmProps] = useState({
		questionMessage: '',
		yesText: '',
		noText: '',
	});

	useEffect(() => {
		if (!purchase) {
			return () => {};
		}

		confirmProps.questionMessage = purchase?.subscription
			? __(
					'Are you sure? Revoking a purchase will trigger cancellation of the associated subscription.',
					'surecart'
			  )
			: __(
					'Are you sure? This action will remove the associated access and trigger any cancelation automations you have set up.',
					'surecart'
			  );
		confirmProps.yesText = __('Revoke Purchase', 'surecart');
		confirmProps.noText = __("Don't revoke purchase", 'surecart');

		if (purchase.revoked) {
			confirmProps.questionMessage = purchase?.subscription
				? __(
						'Are you sure? Unrevoking a purchase will re-enable the associated subscription.',
						'surecart'
				  )
				: __(
						'Are you sure? This action will re-enable associated access.',
						'surecart'
				  );
			confirmProps.yesText = __('Unrevoke Purchase', 'surecart');
			confirmProps.noText = __("Don't unrevoke purchase", 'surecart');
		}

		setConfirmProps({
			...confirmProps,
		});
	}, [purchase, purchase?.subscription]);

	const onSubmit = async (e) => {
		setLoading(true);
		const revoke = !purchase?.revoked;

		try {
			const result = await apiFetch({
				path: addQueryArgs(
					`surecart/v1/purchases/${purchase?.id}/${
						revoke ? 'revoke' : 'invoke'
					}`,
					{
						expand: ['product', 'product.price'],
					}
				),
				method: 'PATCH',
			});
			receiveEntityRecords(
				'surecart',
				'purchase',
				result,
				undefined,
				false,
				purchase
			);
			await invalidateResolutionForStore();
			onRequestClose();
		} catch (e) {
			throw e;
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScForm
			onScFormSubmit={onSubmit}
			css={css`
				--sc-form-row-spacing: var(--sc-spacing-large);
				text-align: left;
			`}
		>
			<ScDialog
				label={__('Confirm', 'surecart')}
				open={open}
				onScRequestClose={onRequestClose}
			>
				<Error error={error} setError={setError} />
				<ScText>{confirmProps.questionMessage}</ScText>
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
					slot="footer"
				>
					{confirmProps.noText}
				</ScButton>{' '}
				<ScButton
					type="primary"
					submit
					disabled={loading}
					slot="footer"
				>
					{confirmProps.yesText}
				</ScButton>
				{loading && (
					<ScBlockUi
						style={{ '--sc-block-ui-opacity': '0.75' }}
						zIndex="9"
						spinner
					/>
				)}
			</ScDialog>
		</ScForm>
	);
};
