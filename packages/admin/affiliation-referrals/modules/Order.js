/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import {
	ScBlockUi,
	ScButton,
	ScFlex,
	ScFormatDate,
	ScOrderStatusBadge,
	ScText,
} from '@surecart/components-react';
import Box from '../../ui/Box';

import { __, _n, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

export default ({ referral, loading }) => {
	const renderOrderDisplay = () => {
		const order = referral?.checkout;
		<ScFlex alignItems="center" justifyContent="space-between">
			<div>
				<div>
					<ScButton
						type="link"
						style={{
							'--font-weight': 'var(--sc-font-weight-semibold)',
						}}
					>
						{`#${order?.number || order?.id}`}
					</ScButton>
				</div>
				<div>
					<ScText
						truncate
						style={{
							'--color': 'var(--sc-color-gray-500)',
						}}
					>
						{sprintf(
							_n(
								'%s item',
								'%s items',
								order?.line_items?.pagination?.count || 0,
								'surecart'
							),
							order?.line_items?.pagination?.count || 0
						)}
					</ScText>
				</div>
				<div>
					<ScOrderStatusBadge status={order?.status} />
				</div>
				<div>
					<ScFormatDate
						type="timestamp"
						month="short"
						day="numeric"
						year="numeric"
						date={order?.created_at}
					/>
				</div>
			</div>

			<ScButton
				href={addQueryArgs('admin.php', {
					page: 'sc-orders',
					action: 'edit',
					id: order?.id,
				})}
				size="small"
			>
				{__('Remove', 'surecart')}
			</ScButton>
		</ScFlex>;
	};

	const renderEmpty = () => {
		return <div>{__('Not associated to any order.', 'surecart')}</div>;
	};

	return (
		<Box title="Order" loading={loading}>
			{referral?.checkout?.id ? renderOrderDisplay() : renderEmpty()}
		</Box>
	);
};
