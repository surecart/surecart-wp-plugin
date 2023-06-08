import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScIcon,
	ScPremiumTag,
	ScStackedListRow,
	ScUpgradeRequired,
} from '@surecart/components-react';
import ClaimNoticeModal from '../../components/ClaimNoticeModal';
import { useState } from 'react';

export default ({
	title,
	description,
	link = 'customer_notifications',
	model,
	action = 'notification',
	disabled = false,
}) => {
	const [open, setOpen] = useState();
	return (
		<>
			<ScStackedListRow style={{ '--columns': '3' }}>
				<strong>
					{title}
					{disabled && (
						<ScUpgradeRequired style={{ marginLeft: '5px' }}>
							<ScPremiumTag />
						</ScUpgradeRequired>
					)}
				</strong>
				<div style={{ opacity: '0.75' }}>{description}</div>
				<ScButton
					size="small"
					slot="suffix"
					onClick={(e) => {
						if (scData?.claim_url) {
							setOpen(true);
							e.preventDefault();
							return false;
						}
						return true;
					}}
					href={
						disabled
							? `#`
							: `${scData?.app_url}/notification_templates/:${link}/${model}/${action}/edit`
					}
					target="_blank"
					disabled={disabled}
				>
					{__('Edit', 'surecart')}
					<ScIcon
						name="external-link"
						slot="suffix"
						style={{ width: '12px', height: '12px' }}
					/>
				</ScButton>
			</ScStackedListRow>
			{open && (
				<ClaimNoticeModal
					title={__('Complete Setup!', 'surecart')}
					bodyText={__(
						'Please complete setting up your store. Its free and only takes a minute.',
						'surecart'
					)}
					onRequestClose={() => setOpen(false)}
					claimUrl={scData?.claim_url}
				/>
			)}
		</>
	);
};
