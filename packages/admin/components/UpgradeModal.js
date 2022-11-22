import { ScButton, ScIcon } from '@surecart/components-react';
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ onRequestClose }) => {
	return (
		<Modal
			title={
				<>
					<ScIcon name="zap" /> {__('Boost your revenue', 'surecart')}
				</>
			}
			onRequestClose={onRequestClose}
		>
			<p>
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
			>
				{__('Upgrade Your Plan', 'surecart')}
			</ScButton>
		</Modal>
	);
};
