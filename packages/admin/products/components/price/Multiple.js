/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScInput } from '@surecart/components-react';
import Amount from './parts/Amount';
import AdHoc from './parts/AdHoc';

export default ({ price, updatePrice }) => {
	return (
		<>
			<Amount price={price} updatePrice={updatePrice} />
			<AdHoc price={price} updatePrice={updatePrice} />
			<sc-flex>
				<ScInput
					label={__('Number of Payments', 'surecart')}
					className="sc-payment-number"
					required
					css={css`
						flex: 1;
					`}
					type="number"
					min={1}
					value={price?.recurring_period_count}
					onScInput={(e) =>
						updatePrice({
							recurring_period_count: parseInt(e.target.value),
						})
					}
				>
					<span slot="suffix">{__('Payments', 'surecart')}</span>
				</ScInput>
				<ScInput
					label={__('Free Trial Days', 'surecart')}
					className="sc-free-trial"
					css={css`
						flex: 1;
					`}
					type="number"
					min={1}
					max={365}
					value={price?.trial_duration_days}
					onScChange={(e) =>
						updatePrice({
							trial_duration_days: parseInt(e.target.value),
						})
					}
				>
					<span slot="suffix">{__('Days', 'surecart')}</span>
				</ScInput>
			</sc-flex>
		</>
	);
};
