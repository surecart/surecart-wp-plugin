import { __, _n, sprintf } from '@wordpress/i18n';
import Box from '../../../ui/Box';
import {
	ScBlockUi,
	ScFormatDate,
	ScFormatNumber,
	ScLineItem,
	ScSwitch,
} from '@surecart/components-react';

export default ({
	upcoming,
	loading,
	skipProration,
	setSkipProration,
	updateBehavior,
}) => {
	const renderPreview = () => {
		const { currency, amount_due } = upcoming?.checkout || {};
		if (amount_due === null) return;

		const hasTrial = upcoming?.checkout?.trial_amount < 0;
		const periodDays = Math.ceil(
			(upcoming?.end_at - upcoming?.start_at) / (60 * 60 * 24)
		);

		return (
			<>
				<ScLineItem
					style={{ '--price-size': 'var(--sc-font-size-large)' }}
				>
					<span slot="title">
						{__('Next Billing Period', 'surecart')}
					</span>
					<ScFormatNumber
						slot="price"
						type="currency"
						currency={currency}
						value={amount_due}
					/>
					<span slot="price-description">
						{updateBehavior === 'immediate' ? (
							__('Bills Now', 'surecart')
						) : (
							<>
								{__('Bills on')}{' '}
								<ScFormatDate
									date={upcoming?.start_at}
									type="timestamp"
									month="long"
									day="numeric"
									year="numeric"
								/>
								{/* <ScFormatDate
								date={upcoming?.end_at}
								type="timestamp"
								month="long"
								day="numeric"
								year="numeric"
								hour="numeric"
								minute="numeric"
							/> */}
							</>
						)}
					</span>
				</ScLineItem>
				{!!hasTrial && (
					<ScLineItem>
						<span slot="title">{__('Free Trial', 'surecart')}</span>
						<span slot="price">
							{sprintf(
								_n(
									'%d day left in trial',
									'%d days left in trial',
									periodDays,
									'surecart'
								),
								periodDays
							)}
						</span>
						<span slot="price-description">
							<>
								{__('Ends on')}{' '}
								<ScFormatDate
									date={upcoming?.end_at}
									type="timestamp"
									month="long"
									day="numeric"
									year="numeric"
								/>
							</>
						</span>
					</ScLineItem>
				)}
			</>
		);
	};

	return (
		<Box
			title={__('Summary', 'surecart')}
			loading={loading && !upcoming?.checkout}
			footer={
				<ScSwitch
					checked={!skipProration}
					onClick={(e) => {
						setSkipProration(!e.target.checked);
					}}
				>
					{__('Prorate Charges', 'surecart')}
				</ScSwitch>
			}
		>
			{renderPreview()}
			{!!upcoming?.checkout && loading && <ScBlockUi spinner />}
		</Box>
	);
};
