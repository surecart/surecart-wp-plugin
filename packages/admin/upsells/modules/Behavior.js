import { __ } from '@wordpress/i18n';
import { ScSwitch } from '@surecart/components-react';

export default ({ upsell, updateUpsell }) => {
	return (
		<ScSwitch
			checked={upsell?.auto_apply}
			onScChange={(e) => {
				updateUpsell({ auto_apply: e.target.checked });
			}}
		>
			{__('Auto Apply Discount')}
			<span slot="description">
				{__(
					'If enabled, the discount will be applied if the display conditions are satisfied, even if they do not click the upsell. If disabled, the discount will only be applied if the customer clicks the upsell.',
					'surecart'
				)}
			</span>
		</ScSwitch>
	);
};
