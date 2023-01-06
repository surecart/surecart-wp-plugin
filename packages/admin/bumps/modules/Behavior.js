import { __ } from '@wordpress/i18n';
import { ScSwitch } from '@surecart/components-react';

export default ({ bump, updateBump }) => {
	return (
		<ScSwitch
			checked={bump?.auto_apply}
			onScChange={(e) => {
				updateBump({ auto_apply: e.target.checked });
			}}
		>
			{__('Auto Apply Discount')}
			<span slot="description">
				{__(
					'If enabled, the discount will be applied if the display conditions are satisfied, even if they do not click the bump. If disabled, the discount will only be applied if the customer clicks the order bump.',
					'surecart'
				)}
			</span>
		</ScSwitch>
	);
};
