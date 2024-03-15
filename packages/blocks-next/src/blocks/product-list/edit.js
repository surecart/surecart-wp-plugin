import { useBlockProps } from '@wordpress/block-editor';
import { Spinner, Placeholder } from '@wordpress/components';
import MultiEdit from '../../components/MultiEdit';

import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

const TEMPLATE = [
	// [ 'surecart/product-image' ],
	[ 'surecart/product-name' ],
	[ 'surecart/product-price-v2' ],
];

export default ({ clientId }) => {
	const blockProps = useBlockProps();

	const { products, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product',
				{
					archived: false,
					status: ['published'],
				},
			];
			return {
				products: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		}
	);
	
	const blockContexts = useMemo(
		() =>
		products?.map( ( product ) => ( {
				'surecart/product-list/id': product?.id,
			} ) ),
		[ products ]
	);
	
	if (loading) {
		return (
			<Placeholder>
				<Spinner />
			</Placeholder>
		);
	}
	
	return (
		<div {...blockProps} >
			<MultiEdit
				template={TEMPLATE}
				blockContexts={blockContexts}
				clientId={clientId}
			/>
		</div>
	);
};
