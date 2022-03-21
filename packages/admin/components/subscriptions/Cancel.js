/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { Modal, Button } from '@wordpress/components';
import { ScForm } from '@surecart/components-react';
import { css, jsx } from '@emotion/core';
import { useState, Fragment } from '@wordpress/element';
import { useEffect } from 'react';

export default ({ onCancel, subscription, loading, error, children, open }) => {
	const [modal, setModal] = useState(false);

	const onSubmit = async (e) => {
		const { cancel_behavior } = await e.target.getFormJson();
		onCancel({ cancel_behavior });
	};

	useEffect(() => {
		setModal(open);
	}, [open]);

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
								<sc-choice
									name="cancel_behavior"
									value="immediate"
									checked
								>
									{__('Immediately', 'surecart')}
								</sc-choice>
								{subscription?.current_period_end_at !==
									null && (
									<sc-choice
										name="cancel_behavior"
										value="pending"
									>
										{__(
											'	At end of current period',
											'surecart'
										)}
									</sc-choice>
								)}
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
