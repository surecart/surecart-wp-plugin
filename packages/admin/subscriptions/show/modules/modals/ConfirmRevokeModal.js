/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScAlert,
	ScBlockUi,
	ScButton,
	ScDialog,
	ScFlex,
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

	const renderConfirmText = () => {
		if (purchase?.subscription) {
			return purchase?.revoked
				? __(
						'The subscription will be restored in order to unrevoked the purchase. The customer will be charged.',
						'surecart'
				  )
				: __(
						'The subscription will be canceled in order to revoke the purchase.',
						'surecart'
				  );
		}

		return purchase?.revoked
			? __('This action will re-enable associated access.', 'surecart')
			: __(
					'This action will remove the associated access and trigger any cancelation automations you have set up.',
					'surecart'
			  );
	};

	const renderConfirmButton = () => {
		if (purchase?.subscription) {
			return purchase?.revoked
				? __('Unrevoke Purchase & Restore Subscription', 'surecart')
				: __('Revoke Purchase & Cancel Subscription', 'surecart');
		}

		return purchase?.revoked
			? __('Unrevoke Purchase', 'surecart')
			: __('Revoke Purchase', 'surecart');
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
				<ScFlex flexDirection="column">
					<ScAlert
						type="warning"
						title={__('Warning', 'surecart')}
						open={purchase?.subscription && purchase?.revoked}
					>
						{__(
							'This will charge the customer for their current billing period.',
							'surecart'
						)}
					</ScAlert>
					<ScText
						style={{
							'--font-size': 'var(--sc-font-size-medium)',
							'--color': 'var(--sc-input-label-color)',
							'--line-height': 'var(--sc-line-height-dense)',
						}}
					>
						{renderConfirmText()}
					</ScText>
				</ScFlex>
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
					{renderConfirmButton()}
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
