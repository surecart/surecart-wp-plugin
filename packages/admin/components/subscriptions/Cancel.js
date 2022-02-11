/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { Modal, Button } from '@wordpress/components';
import { CeForm } from '@checkout-engine/components-react';
import { css, jsx } from '@emotion/core';
import { useState, Fragment } from '@wordpress/element';
import { useEffect } from 'react';

export default ({ onCancel, loading, error, children, open }) => {
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
				<ce-button
					size="small"
					onClick={() => setModal(!modal)}
					loading={loading}
				>
					{__('Cancel', 'checkout_engine')}
				</ce-button>
			)}
			{modal && (
				<Modal
					title={__('Cancel Subscription', 'checkout_engine')}
					css={css`
						max-width: 500px !important;
					`}
					onRequestClose={() => setModal(false)}
					shouldCloseOnClickOutside={false}
				>
					<CeForm
						onCeFormSubmit={onSubmit}
						css={css`
							--ce-form-row-spacing: var(--ce-spacing-large);
						`}
					>
						<ce-alert type="danger" open={error}>
							{error}
						</ce-alert>

						<ce-choices label={__('Cancel', 'checkout_engine')}>
							<div>
								<ce-choice
									name="cancel_behavior"
									value="pending"
									checked
								>
									{__(
										'	At end of current period',
										'checkout_engine'
									)}
								</ce-choice>
								<ce-choice
									name="cancel_behavior"
									value="immediate"
								>
									{__('Immediately', 'checkout_engine')}
								</ce-choice>
							</div>
						</ce-choices>

						<div
							css={css`
								display: flex;
								align-items: center;
								gap: 0.5em;
							`}
						>
							<Button isPrimary isBusy={loading} type="submit">
								{__('Cancel Subscription', 'checkout_engine')}
							</Button>
							<Button onClick={() => setModal(false)}>
								{__("Don't Cancel", 'checkout_engine')}
							</Button>
						</div>
					</CeForm>
				</Modal>
			)}
		</Fragment>
	);
};
