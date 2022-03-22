/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { Modal, Button } from '@wordpress/components';
import { ScForm } from '@surecart/components-react';
import { css, jsx } from '@emotion/core';
import apiFetch from '@wordpress/api-fetch';
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { Fragment } from '@wordpress/element';
import useEntity from '../../../mixins/useEntity';

export default ({ subscription, children }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [modal, setModal] = useState(false);
	const { receiveEntity } = useEntity('subscription', subscription?.id);

	const onSubmit = async (e) => {
		const { cancel_behavior } = await e.target.getFormJson();

		setError(false);
		setLoading(true);
		try {
			const result = await apiFetch({
				path: addQueryArgs(
					`surecart/v1/subscriptions/${subscription.id}/cancel`,
					{
						cancel_behavior,
						expand: [
							'price',
							'price.product',
							'latest_invoice',
							'purchase',
						],
					}
				),
				method: 'PATCH',
			});
			if (result.id) {
				receiveEntity(result);
				setModal(false);
			} else {
				throw __('Could not cancel subscription.', 'surecart');
			}
		} catch (e) {
			console.error(e);
			if (e?.additional_errors?.[0]?.message) {
				setError(e?.additional_errors?.[0]?.message);
			} else {
				setError(
					e?.message ||
						__('Failed to cancel subscription.', 'surecart')
				);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Fragment>
			{children ? (
				<span onClick={() => setModal(!modal)}>{children}</span>
			) : (
				<sc-button
					size="small"
					onClick={() => setModal(!modal)}
					loading={loading}
				>
					{__('Cancel', 'surecart')}
				</sc-button>
			)}
			{modal && (
				<Modal
					title={__('Cancel Subscription', 'surecart')}
					css={css`
						max-width: 500px !important;
					`}
					onRequestClose={() => setModal(false)}
					shouldCloseOnClickOutside={false}
				>
					<ScForm
						onScFormSubmit={onSubmit}
						css={css`
							--sc-form-row-spacing: var(--sc-spacing-large);
						`}
					>
						<sc-alert type="danger" open={error}>
							{error}
						</sc-alert>

						<sc-choices label={__('Cancel', 'surecart')}>
							<div>
								{subscription?.current_period_end_at !==
									null && (
									<sc-choice
										name="cancel_behavior"
										value="pending"
										checked
									>
										{__(
											'	At end of current period',
											'surecart'
										)}
									</sc-choice>
								)}
								<sc-choice
									name="cancel_behavior"
									value="immediate"
								>
									{__('Immediately', 'surecart')}
								</sc-choice>
							</div>
						</sc-choices>

						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 0.5em;
							`}
						>
							<Button isPrimary isBusy={loading} type="submit">
								{__('Cancel Subscription', 'surecart')}
							</Button>
							<Button onClick={() => setModal(false)}>
								{__("Don't Cancel", 'surecart')}
							</Button>
						</div>
					</ScForm>
				</Modal>
			)}
		</Fragment>
	);
};
