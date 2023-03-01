/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScInput } from '@surecart/components-react';
import { Flex, FlexBlock } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import AdHoc from './parts/AdHoc';
import Amount from './parts/Amount';
import ScratchAmount from './parts/ScratchAmount';
import Trial from './parts/Trial';

export default ({ price, updatePrice }) => {
	return (
		<>
			<Flex>
				<FlexBlock>
					<Amount price={price} updatePrice={updatePrice} />
				</FlexBlock>
				<FlexBlock>
					<ScratchAmount price={price} updatePrice={updatePrice} />
				</FlexBlock>
			</Flex>
			<AdHoc price={price} updatePrice={updatePrice} />
			<sc-flex>
				{!price?.id && (
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
								recurring_period_count: parseInt(
									e.target.value
								),
							})
						}
					>
						<span slot="suffix">{__('Payments', 'surecart')}</span>
					</ScInput>
				)}
				<Trial
					css={css`
						flex: 1;
					`}
					price={price}
					updatePrice={updatePrice}
				/>
			</sc-flex>
		</>
	);
};
