/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

import {
	ScSwitch
} from '@surecart/components-react';

export default ({ price, updatePrice }) => {
	
	return (
		<>
			<ScSwitch
				checked={ 'cancel' === price?.recurring_end_behavior }
				onScChange={(e) => {
					updatePrice({ recurring_end_behavior: e?.target?.checked ? 'cancel' : 'complete' })
				}}
			>
				{__('Limited Time Subscription', 'surecart')}
			</ScSwitch>
		</>
	);
};
