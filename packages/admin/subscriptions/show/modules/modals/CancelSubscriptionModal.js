/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScBlockUi,
	ScButton,
	ScChoice,
	ScChoices,
	ScDialog,
	ScForm,
} from '@surecart/components-react';
import Error from '../../../../components/Error';

export default ({
	subscription,
	open,
	onRequestClose,
	onCancel,
	loading,
	error,
	setError,
}) => {
	const [checked, setChecked] = useState('immediate');

	return (
		<ScForm
			onScFormSubmit={onCancel}
			css={css`
				--sc-form-row-spacing: var(--sc-spacing-large);
			`}
		>
			<ScDialog
				label={__('Confirm', 'surecart')}
				open={open}
				onScRequestClose={onRequestClose}
			>
				<Error error={error} setError={setError} />
				<ScChoices
					label={__(
						'When do you want to cancel the subscription?',
						'surecart'
					)}
				>
					<div>
						<ScChoice
							name="cancel_behavior"
							value="immediate"
							checked={checked === 'immediate'}
							onClick={() => setChecked('immediate')}
						>
							{__('Immediately', 'surecart')}
						</ScChoice>
						{subscription?.current_period_end_at !== null && (
							<ScChoice
								name="cancel_behavior"
								checked={checked === 'pending'}
								value="pending"
								onClick={() => setChecked('pending')}
							>
								{__('	At end of current period', 'surecart')}
							</ScChoice>
						)}
					</div>
				</ScChoices>
				<ScButton
					type="text"
					onClick={onRequestClose}
					disabled={loading}
					slot="footer"
				>
					{__("Don't cancel", 'surecart')}
				</ScButton>{' '}
				<ScButton
					type="primary"
					submit
					disabled={loading}
					slot="footer"
				>
					{checked === 'immediate'
						? __('Cancel Subscription', 'surecart')
						: __('Schedule Cancellation', 'surecart')}
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
