import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { createNavigationLinks } from './use-convert-to-navigation-links';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
export default ({ attributes, setAttributes, clientId }) => {
	
	const [collectionPages, setCollectionPages] = useState(null);
	const { replaceBlock, selectBlock } = useDispatch( blockEditorStore );
	const {
		parentClientId,
	} = useSelect(
		( select ) => {
			const {
				getBlockParentsByBlockName,
			} = select( blockEditorStore );
			const navigationBlockParents = getBlockParentsByBlockName(
				clientId,
				'core/navigation',
				true
			);
			return {
				parentClientId: navigationBlockParents[ 0 ],
			};
		},
		[ clientId ]
	);

	useEffect(() => {
		getCollectionPages();
	}, []);

	useEffect(() => {
		if ( collectionPages ) {
			console.log('collectionPages', collectionPages);
			useConvertToNavigationLinks( {
				clientId,
				collectionPages,
				parentClientId
			} );
		}
	}, [collectionPages]);

	const getCollectionPages = async () => {
		const pages = await apiFetch({
			path: '/surecart/v1/product_collections',
		});
		setCollectionPages(pages);
	};

	const useConvertToNavigationLinks = ( {
		clientId,
		collectionPages,
		parentClientId,
	} ) => {
		console.log('useConvertToNavigationLinks', collectionPages);
		
		const navigationLinks = createNavigationLinks( collectionPages );

		// Replace the Page List block with the Navigation Links.
		replaceBlock( clientId, navigationLinks );

		// Select the Navigation block to reveal the changes.
		selectBlock( parentClientId );
	}

	return (
		''
	);
};
