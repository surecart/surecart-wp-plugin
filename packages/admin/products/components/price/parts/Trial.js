import { __ } from '@wordpress/i18n';
import { ScFormControl, ScInput, ScTag } from '@surecart/components-react';
import { useDispatch } from '@wordpress/data';
import { store as uiStore } from '@surecart/ui-data';

export default ({ className, price, updatePrice }) => {
	const { setUpgradeModal } = useDispatch(uiStore);

	// must have the
	if (!scData?.entitlements?.subscription_trials) {
		return (
			<ScFormControl label={true} style={{ flex: 1 }}>
				<span slot="label">
					{__('Free Trial Days', 'surecart')}{' '}
					<ScTag type="success" size="small" pill slot="prefix">
						{__('Premium', 'surecart')}
					</ScTag>
				</span>
				<ScInput
					onClick={() => setUpgradeModal(true)}
					className={className}
					type="number"
					min={1}
					max={365}
					value={price?.trial_duration_days}
					onScInput={() =>
						updatePrice({
							trial_duration_days: null,
						})
					}
				>
					<span slot="suffix">{__('Days', 'surecart')}</span>
				</ScInput>
			</ScFormControl>
		);
	}

	return (
		<ScInput
			label={__('Free Trial Days', 'surecart')}
			className={className}
			type="number"
			min={1}
			max={365}
			value={price?.trial_duration_days}
			onScInput={(e) =>
				updatePrice({
					trial_duration_days: parseInt(e.target.value),
				})
			}
		>
			<span slot="suffix">{__('Days', 'surecart')}</span>
		</ScInput>
	);
};
