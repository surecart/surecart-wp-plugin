/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Trial from './parts/Trial';
import Amount from './parts/Amount';
import AdHoc from './parts/AdHoc';
import ScratchAmount from './parts/ScratchAmount';
import SetupFee from './parts/SetupFee';
import LicenseActivationLimit from './parts/LicenseActivationLimit';
import DrawerSection from '../../../ui/DrawerSection';
import PriceName from './parts/PriceName';
import CanUpgrade from './parts/CanUpgrade';

export default ({ price, updatePrice, product }) => {
	return (
		<>
			<PriceName price={price} updatePrice={updatePrice} />
			<Amount price={price} updatePrice={updatePrice} />
			<ScratchAmount price={price} updatePrice={updatePrice} />

			<DrawerSection title={__('Pricing Options', 'surecart')}>
				<AdHoc price={price} updatePrice={updatePrice} />
				<SetupFee price={price} updatePrice={updatePrice} />
				<CanUpgrade price={price} updatePrice={updatePrice} />
			</DrawerSection>

			<DrawerSection title={__('Trial Settings', 'surecart')}>
				<Trial price={price} updatePrice={updatePrice} />
			</DrawerSection>

			{!!product?.licensing_enabled && (
				<DrawerSection title={__('Licensing Options', 'surecart')}>
					<LicenseActivationLimit
						price={price}
						updatePrice={updatePrice}
						product={product}
					/>
				</DrawerSection>
			)}
		</>
	);
};
