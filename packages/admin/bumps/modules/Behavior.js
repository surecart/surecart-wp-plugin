import { __ } from '@wordpress/i18n';
import { ScSwitch } from '@surecart/components-react';
import BoxMinimal from '../../ui/Box-Minimal';

export default ({ bump, updateBump, loading }) => {
	return (
		<BoxMinimal loading={loading}>
			<ScSwitch
				checked={bump?.auto_apply}
				onScChange={(e) => {
					updateBump({ auto_apply: e.target.checked });
				}}

			>
				{__('Auto Apply Discount')}
				<span slot="description">
					{__(
						'Automatically apply the discount if the customer has added the price to their checkout outside of the checkout form. If disabled, the discount will only be applied if the customer applies the bump from within the checkout form.',
						'surecart'
					)}
				</span>
			</ScSwitch>
		</BoxMinimal>
	);
};
