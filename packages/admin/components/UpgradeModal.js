/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScFlex, ScIcon } from '@surecart/components-react';
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ onRequestClose }) => {
	return (
		<Modal
			css={css`
				max-width: 375px !important;
			`}
			title={
				<ScFlex alignItems="center">
					<ScIcon
						name="zap"
						style={{ color: 'var(--sc-color-brand-primary)' }}
					/>
					<span>{__('Boost Your Revenue', 'surecart')}</span>
				</ScFlex>
			}
			onRequestClose={onRequestClose}
		>
			<p style={{ fontSize: 'var(--sc-font-size-large)' }}>
				{__(
					'Unlock revenue boosting features when you upgrade your plan!',
					'surecart'
				)}
			</p>
			<ScButton
				style={{
					'--sc-color-primary-500': 'var(--sc-color-brand-primary)',
				}}
				href={scData?.upgrade_url || 'https://app.surecart.com'}
				type="primary"
				target="_blank"
				full
			>
				{__('Upgrade Your Plan', 'surecart')}
			</ScButton>
		</Modal>
	);
};
