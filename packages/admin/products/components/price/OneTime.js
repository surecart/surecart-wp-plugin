import { __ } from '@wordpress/i18n';
import AdHoc from './parts/AdHoc';
import RevokeAfterDays from './parts/RevokeAfterDays';
import DrawerSection from '../../../ui/DrawerSection';

export default ({ price, updatePrice }) => {
	return (
		<>
			<DrawerSection title={__('Price Options', 'surecart')}>
				<AdHoc price={price} updatePrice={updatePrice} />
				<RevokeAfterDays price={price} updatePrice={updatePrice} />
			</DrawerSection>
		</>
	);
};
