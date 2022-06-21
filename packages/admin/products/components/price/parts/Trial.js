import { __ } from '@wordpress/i18n';
import { ScInput } from '@surecart/components-react';

export default ({ className, price, updatePrice }) => {
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
