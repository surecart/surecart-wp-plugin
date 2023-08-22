import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { createNavigationLink } from './use-convert-to-navigation-links';
import { useSelect, useDispatch } from '@wordpress/data';
import { Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { 
	store as blockEditorStore, 
	useBlockProps, __experimentalLinkControl as LinkControl
} from '@wordpress/block-editor';
import ModelSelector from '../../../admin/components/ModelSelector';

export default ({ clientId }) => {
	
	const [collectionPage, setCollectionPage] = useState(null);
	const [modal, setModal] = useState(false);
	const { replaceBlock, selectBlock } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps();
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
		if ( ! collectionPage ) {
			setModal(true);
		}
	}, []);

	const getCollectionPage = async (id) => {
		
		const collectionPage = await apiFetch({
			path: `/surecart/v1/product_collections/${id}`,
		});
		setCollectionPage(collectionPage);
		useConvertToNavigationLinks({clientId, collectionPage, parentClientId});
	};

	const useConvertToNavigationLinks = ( {
		clientId,
		collectionPage,
		parentClientId,
	} ) => {
		
		const navigationLink = createNavigationLink( collectionPage );

		// Replace the Page List block with the Navigation Links.
		replaceBlock( clientId, navigationLink );

		// Select the Navigation block to reveal the changes.
		selectBlock( parentClientId );
	}

	return (
		<>
			{ !collectionPage && (
				<div {...blockProps} onClick={() => setModal(true)}>
					{__('Select a Collection Page...', 'surecart')}
				</div>
			)}
			{modal && (
				<Popover
					placement="bottom"
					shift
					resize={false}
				>
					<div
						style={{
							width: '20em',
						}}
					>
						<ModelSelector
							placeholder={__(
								'Select a Collection Page',
								'surecart'
							)}
							placement={'bottom-end'}
							name="product-collection"
							onSelect={(collectionId) => {
								setModal(false);
								getCollectionPage(collectionId);
							}}
							style={{ width: '100%' }}
							open={true}
							fetchOnLoad={true}
						/>
					</div>
				</Popover>
			)}
		</>
	);
};
