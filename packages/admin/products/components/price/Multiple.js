import { __ } from '@wordpress/i18n';
import SetupFee from './parts/SetupFee';

import AdHoc from './parts/AdHoc';
import Trial from './parts/Trial';
import RevokeAccess from './parts/RevokeAccess';
import RestartSubscription from './parts/RestartSubscription';
import DrawerSection from '../../../ui/DrawerSection';

export default ({ price, updatePrice }) => {
	return (
		<>
			<DrawerSection title={__('Price Options', 'surecart')}>
				<AdHoc price={price} updatePrice={updatePrice} />
				<RevokeAccess price={price} updatePrice={updatePrice} />
				<RestartSubscription price={price} updatePrice={updatePrice} />
				<SetupFee price={price} updatePrice={updatePrice} />
				<Trial price={price} updatePrice={updatePrice} />
			</DrawerSection>
		</>
	);
};
