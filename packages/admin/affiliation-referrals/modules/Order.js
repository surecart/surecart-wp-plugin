/** @jsx jsx */
/**
 * External dependencies.
 */
import { jsx } from '@emotion/core';

/**
 * Internal dependencies.
 */
import { ScFlex, ScOrderStatusBadge } from '@surecart/components-react';
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';

/**
 * Wordpress dependencies.
 */
import { __, _n } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export default ({ referral, loading }) => {
	const { checkout, loadingCheckout } = useSelect(
		(select) => {
			if (!referral?.checkout) {
				return {};
			}

			const queryArgs = [
				'surecart',
				'checkout',
				referral?.checkout,
				{
					expand: ['order'],
				},
			];

			return {
				checkout: select(coreStore).getEntityRecord(...queryArgs),
				loadingCheckout: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[referral?.checkout]
	);

	const renderOrderDisplay = () => {
		const order = checkout?.order;

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
		<Box title="Order" loading={loading || loadingCheckout}>
			{checkout?.order?.id ? renderOrderDisplay() : renderEmpty()}
		</Box>
	);
};
