import { __ } from '@wordpress/i18n';
import AdHoc from './parts/AdHoc';
import Amount from './parts/Amount';
import ScratchAmount from './parts/ScratchAmount';
import { Flex, FlexBlock } from '@wordpress/components';
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
