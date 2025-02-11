import { __ } from '@wordpress/i18n';
import Trial from './parts/Trial';
import Amount from './parts/Amount';
import AdHoc from './parts/AdHoc';
import ScratchAmount from './parts/ScratchAmount';
import SetupFee from './parts/SetupFee';
import DrawerSection from '../../../ui/DrawerSection';

export default ({ price, updatePrice }) => {
	return (
		<>
			<DrawerSection title={__('Pricing Options', 'surecart')}>
				<AdHoc price={price} updatePrice={updatePrice} />
				<SetupFee price={price} updatePrice={updatePrice} />
				<Trial price={price} updatePrice={updatePrice} />
			</DrawerSection>
		</>
	);
};
