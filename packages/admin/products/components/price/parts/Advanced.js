import { __ } from '@wordpress/i18n';
import DrawerSection from '../../../../ui/DrawerSection';
import CanUpgrade from './CanUpgrade';
import LicenseActivationLimit from './LicenseActivationLimit';
import RestartSubscription from './RestartSubscription';

export const Advanced = ({ price, updatePrice, product }) => {
	return (
		<DrawerSection title={__('Advanced', 'surecart')}>
			<CanUpgrade price={price} updatePrice={updatePrice} />
			<LicenseActivationLimit
				price={price}
				updatePrice={updatePrice}
				product={product}
			/>
			<RestartSubscription price={price} updatePrice={updatePrice} />
		</DrawerSection>
	);
};

export default Advanced;
