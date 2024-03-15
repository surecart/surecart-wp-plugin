import {
	BlockContextProvider,
	__experimentalUseBlockPreview as useBlockPreview,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Spinner, Placeholder } from '@wordpress/components';
import MultiEdit from '../../components/MultiEdit';

import { __ } from '@wordpress/i18n';
import { memo, useMemo, useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch, useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

const TEMPLATE = [
	// [ 'surecart/product-image' ],
	[ 'surecart/product-name' ],
	[ 'surecart/product-price-v2' ],
];

export default ({ attributes, setAttributes, clientId }) => {
	const { product_id } = attributes;
	const [isLoading, setIsLoading] = useState(false);
	const [ activeBlockContextId, setActiveBlockContextId ] = useState();
	const [products, setProducts] = useState([]);
	const blockProps = useBlockProps();

	useEffect(() => {
		fetchProducts();
	}, []);

	const blockContexts = useMemo(
		() =>
		products?.map( ( product ) => ( {
				id: product?.id,
				name: product?.name,
				image: product?.image_url,
				metrics: product?.metrics,
				prices: product?.prices,
			} ) ),
		[ products ]
	);
	
	const fetchProducts = async () => {
		const { baseURL } = select(coreStore).getEntityConfig('surecart', 'product');
		if (!baseURL) return;

		const queryArgs = {
			page: 1,
			per_page: 10,
			archived: false,
			expand: ['prices'],
			status: ['published'],
		};

		try {
			setIsLoading(true);

			// fetch.
			const response = await apiFetch({
				path: addQueryArgs(baseURL, queryArgs),
				parse: false,
			});

			// get response.
			const data = await response.json();

			setProducts(data);
	
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
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
