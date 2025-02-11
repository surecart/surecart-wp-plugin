/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScInput, ScSwitch } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import SetupFee from './parts/SetupFee';

import AdHoc from './parts/AdHoc';
import Amount from './parts/Amount';
import ScratchAmount from './parts/ScratchAmount';
import Trial from './parts/Trial';
import RevokeAccess from './parts/RevokeAccess';
import DrawerSection from '../../../ui/DrawerSection';

export default ({ price, updatePrice }) => {
	return (
		<>
			<DrawerSection title={__('Price Options', 'surecart')}>
				<RevokeAccess price={price} updatePrice={updatePrice} />
				<AdHoc price={price} updatePrice={updatePrice} />
				<SetupFee price={price} updatePrice={updatePrice} />
				<Trial price={price} updatePrice={updatePrice} />
			</DrawerSection>
		</>
	);
};
