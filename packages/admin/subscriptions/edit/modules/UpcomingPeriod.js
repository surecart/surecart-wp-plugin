import { __ } from '@wordpress/i18n';
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
		if (!amount_due) return;
		return (
			<ScLineItem style={{ '--price-size': 'var(--sc-font-size-large)' }}>
				<span slot="title">{__('Next Payment', 'surecart')}</span>
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
								date={
									upcoming?.subscription
										?.current_period_end_at
								}
								type="timestamp"
								month="long"
								day="numeric"
								year="numeric"
							/>
						</>
					)}
				</span>
			</ScLineItem>
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
