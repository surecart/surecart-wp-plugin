import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies.
 */
import Definition from '../../ui/Definition';
import { ScIcon } from '@surecart/components-react';

export default ({ review, loading }) => {
	const { customer, customerLoading } = useSelect(
		(select) => {
			const queryArgs = ['surecart', 'customer', review?.customer_id];
			return {
				customer: select(coreStore).getEntityRecord(...queryArgs),
				customerLoading: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[review?.customer_id]
	);

	return (
		<Definition title={__('Customer', 'surecart')}>
			{customerLoading || loading ? (
				'-'
			) : (
				<Button
					variant="link"
					href={addQueryArgs('admin.php', {
						page: 'sc-customers',
						action: 'edit',
						id: customer?.id,
					})}
					target="_blank"
					icon={<ScIcon name="external-link" />}
					iconPosition="right"
					style={{ textDecoration: 'none', padding: 0 }}
				>
					{customer?.name || customer?.email || '-'}
				</Button>
			)}
		</Definition>
	);
};
