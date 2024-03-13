import {
	BlockContextProvider,
	__experimentalUseBlockPreview as useBlockPreview,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { Spinner, Placeholder } from '@wordpress/components';

import { __ } from '@wordpress/i18n';
import { memo, useMemo, useState, useEffect } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { select, useDispatch, useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

const TEMPLATE = [
	// [ 'surecart/product-image' ],
	[ 'surecart/product-name' ],
	// [ 'surecart/product-price-v2' ],
];

function PostTemplateInnerBlocks() {
	const innerBlocksProps = useInnerBlocksProps(
		{ template: TEMPLATE }
	);
	return <div { ...innerBlocksProps } />;
}

function PostTemplateBlockPreview( {
	blocks,
	blockContextId,
	isHidden,
	setActiveBlockContextId,
} ) {
	const blockPreviewProps = useBlockPreview( {
		blocks,
		props: {
			className: 'wp-block-product-list',
		},
	} );

	const handleOnClick = () => {
		setActiveBlockContextId( blockContextId );
	};

	const style = {
		display: isHidden ? 'none' : undefined,
	};

	return (
		<div
			{ ...blockPreviewProps }
			tabIndex={ 0 }
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
			role="button"
			onClick={ handleOnClick }
			onKeyPress={ handleOnClick }
			style={ style }
		/>
	);
}

const MemoizedPostTemplateBlockPreview = memo( PostTemplateBlockPreview );

export default ({ attributes, setAttributes, clientId }) => {
	const { product_id } = attributes;
	const [isLoading, setIsLoading] = useState(false);
	const [ activeBlockContextId, setActiveBlockContextId ] = useState();
	const [products, setProducts] = useState([]);
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
	});
	useEffect(() => {
		fetchProducts();
	}, []);

	const { blocks } = useSelect(
		( select ) => {
			const { getBlocks } = select( blockEditorStore );
			return {
				blocks: getBlocks( clientId ),
			};
		},
		[
			clientId,
		]
	);

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
	console.log(blockContexts);
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
	console.log(products);
	return (
		<div {...innerBlocksProps} >
		{ blockContexts &&
			blockContexts.map( ( blockContext ) => (
				<BlockContextProvider
					key={ blockContext.id }
					value={ blockContext }
				>
					{ blockContext.id ===
					( activeBlockContextId ||
						blockContexts[ 0 ]?.id ) ? (
						<PostTemplateInnerBlocks />
					) : null }
					<MemoizedPostTemplateBlockPreview
						blocks={ blocks }
						blockContextId={ blockContext.id }
						setActiveBlockContextId={
							setActiveBlockContextId
						}
						isHidden={
							blockContext.id ===
							( activeBlockContextId ||
								blockContexts[ 0 ]?.id )
						}
					/>
				</BlockContextProvider>
			) ) }
		</div>
	);
};
