/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ScFlex, ScOrderStatusBadge } from '@surecart/components-react';
import Box from '../../ui/Box';

import { __, _n } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import Definition from '../../ui/Definition';

export default ({ referral, loading }) => {
	const renderOrderDisplay = () => {
		const order = referral?.checkout;

		return (
			<ScFlex flexDirection="column">
				<Definition title={__('Order Number', 'surecart')}>
					<a
						href={addQueryArgs('admin.php', {
							page: 'sc-orders',
							action: 'edit',
							id: order?.id,
						})}
					>
						{`#${order?.number || order?.id}`}
					</a>
				</Definition>
				<Definition title={__('Status', 'surecart')}>
					<ScOrderStatusBadge status={order?.status} />
				</Definition>
			</ScFlex>
		);
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
