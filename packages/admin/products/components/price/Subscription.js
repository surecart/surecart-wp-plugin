/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Trial from './parts/Trial';
import Amount from './parts/Amount';
import AdHoc from './parts/AdHoc';
import ScratchAmount from './parts/ScratchAmount';
import SetupFee from './parts/SetupFee';
import { ScFlex } from '@surecart/components-react';
import LicenseActivationLimit from './parts/LicenseActivationLimit';

export default ({ price, updatePrice, licensingEnabled }) => {
	return (
		<>
			<Amount price={price} updatePrice={updatePrice} />
			<ScFlex>
				<ScratchAmount
					css={css`
						flex: 1;
					`}
					price={price}
					updatePrice={updatePrice}
				/>
				{licensingEnabled && (
					<LicenseActivationLimit
						price={price}
						updatePrice={updatePrice}
						css={css`
							flex: 1;
						`}
					/>
				)}
			</ScFlex>
			<AdHoc price={price} updatePrice={updatePrice} />
			<SetupFee price={price} updatePrice={updatePrice} />
			<Trial price={price} updatePrice={updatePrice} />
		</>
	);
};
