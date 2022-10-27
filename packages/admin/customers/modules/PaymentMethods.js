import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __, _n } from '@wordpress/i18n';

export default ({ customerId }) => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);

	const { paymentMethods, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'order',
				{
					context: 'edit',
					customer_ids: [customerId],
					expand: ['checkout', 'checkout.line_items'],
					page,
					per_page: perPage,
				},
			];
			const paymentMethods = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				paymentMethods,
				loading: loading && page === 1,
			};
		},
		[customerId, page, perPage]
	);

	return (
		<div>
      Test Methods
      {console.log(paymentMethods)}
    </div>
	);
};
