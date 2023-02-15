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
import Error from '../../../../components/Error';

export default ({ purchase, open, onRequestClose }) => {
	const { receiveEntityRecords, invalidateResolutionForStore } =
		useDispatch(coreStore);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const onSubmit = async () => {
		try {
			setLoading(true);
			const result = await apiFetch({
				path: addQueryArgs(
					`surecart/v1/purchases/${purchase?.id}/${
						!purchase?.revoked ? 'revoke' : 'invoke'
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
			console.error(e);
			setError(e);
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
				<ScText>
					{purchase?.subscription
						? __(
								'Are you sure? Revoking a purchase will also cancel the associated subscription.',
								'surecart'
						  )
						: __(
								'Are you sure? This action will remove the associated access and trigger any cancelation automations you have set up.',
								'surecart'
						  )}
				</ScText>
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
					slot="footer"
				>
					{__('Cancel', 'surecart')}
				</ScButton>{' '}
				<ScButton
					type="primary"
					submit
					disabled={loading}
					slot="footer"
				>
					{purchase?.revoked
						? __('Unrevoke Purchase', 'surecart')
						: __('Revoke Purchase', 'surecart')}
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
