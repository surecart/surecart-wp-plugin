import { __ } from '@wordpress/i18n';
import AdHoc from './parts/AdHoc';
import Amount from './parts/Amount';
import ScratchAmount from './parts/ScratchAmount';
import { Flex, FlexBlock } from '@wordpress/components';
import RevokeAfterDays from './parts/RevokeAfterDays';
import LicenseActivationLimit from './parts/LicenseActivationLimit';
import DrawerSection from '../../../ui/DrawerSection';
import { ScDivider } from '@surecart/components-react';
import CanUpgrade from './parts/CanUpgrade';

export default ({ price, updatePrice, product }) => {
	return (
		<>
			<Flex gap={4}>
				<FlexBlock>
					<Amount price={price} updatePrice={updatePrice} />
				</FlexBlock>
				<FlexBlock>
					<ScratchAmount price={price} updatePrice={updatePrice} />
				</FlexBlock>
			</Flex>

			<DrawerSection title={__('Price Options', 'surecart')}>
				<AdHoc price={price} updatePrice={updatePrice} />
				<ScDivider />
				<RevokeAfterDays price={price} updatePrice={updatePrice} />
				<ScDivider />
				<CanUpgrade price={price} updatePrice={updatePrice} />
				<LicenseActivationLimit
					price={price}
					updatePrice={updatePrice}
					product={product}
				/>
			</DrawerSection>
		</>
	);
};
