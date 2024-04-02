/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Trial from './parts/Trial';
import Amount from './parts/Amount';
import AdHoc from './parts/AdHoc';
import ScratchAmount from './parts/ScratchAmount';
import SetupFee from './parts/SetupFee';
import LicenseActivationLimit from './parts/LicenseActivationLimit';

export default ({ price, updatePrice, product }) => {
	return (
		<>
			<Amount price={price} updatePrice={updatePrice} />
			<ScratchAmount price={price} updatePrice={updatePrice} />
			<AdHoc price={price} updatePrice={updatePrice} />
			<SetupFee price={price} updatePrice={updatePrice} />
			<Trial price={price} updatePrice={updatePrice} />
			<LicenseActivationLimit
				price={price}
				updatePrice={updatePrice}
				product={product}
			/>
		</>
	);
};
