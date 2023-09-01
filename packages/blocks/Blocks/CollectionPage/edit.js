import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect, useRef } from '@wordpress/element';
import { createNavigationLink } from './use-convert-to-navigation-links';
import { useSelect, useDispatch } from '@wordpress/data';
import { Popover } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import ModelSelector from '../../../admin/components/ModelSelector';
import { ScInput } from '@surecart/components-react';
import { MenuItem, TextHighlight, MenuGroup } from '@wordpress/components';
import {
	Icon,
	page,
	category,
} from '@wordpress/icons';
import { __unstableStripHTML as stripHTML } from '@wordpress/dom';
import { safeDecodeURI, filterURLForDisplay } from '@wordpress/url';

export default ({ clientId }) => {
	const anchorRef = useRef(null);
	const [collectionPage, setCollectionPage] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [modal, setModal] = useState(false);
	const [placeholderText, setPlaceholderText] = useState(
		__('Select Collection Page', 'surecart')
	);
	const [collectionPages, setCollectionPages] = useState(null);

	const [loadingPage, setLoadingPage] = useState(false);
	const { replaceBlock, selectBlock } = useDispatch(blockEditorStore);
	const blockProps = useBlockProps({
		ref: anchorRef,
	});
	const { parentClientId } = useSelect(
		(select) => {
			const { getBlockParentsByBlockName } = select(blockEditorStore);
			const navigationBlockParents = getBlockParentsByBlockName(
				clientId,
				'core/navigation',
				true
			);
			return {
				parentClientId: navigationBlockParents[0],
			};
		},
		[clientId]
	);

	useEffect(() => {
		if (!collectionPage) {
			setModal(true);
		}
		if (!collectionPages) {
			getCollectionPages();
		}
	}, []);

	const getCollectionPage = async (id) => {
		const collectionPage = await apiFetch({
			path: `/surecart/v1/product_collections/${id}`,
		});
		setCollectionPage(collectionPage);
		useConvertToNavigationLinks({
			clientId,
			collectionPage,
			parentClientId,
		});
	};

	const getCollectionPages = async () => {
		const pages = await apiFetch({
			path: '/surecart/v1/product_collections',
		});
		setCollectionPages(pages);
	};

	const useConvertToNavigationLinks = ({
		clientId,
		collectionPage,
		parentClientId,
	}) => {
		const navigationLink = createNavigationLink(collectionPage);

		// Replace the Page List block with the Navigation Links.
		replaceBlock(clientId, navigationLink);

		// Select the Navigation block to reveal the changes.
		selectBlock(parentClientId);
	};

	return (
		<>
			{(!collectionPage || loadingPage) && (
				<div
					ref={anchorRef}
					{...blockProps}
					onClick={() => setModal(true)}
					style={{
						cursor: 'pointer',
					}}
				>
					{placeholderText}
				</div>
			)}
			{modal && (
				<Popover
					placement="bottom"
					shift
					anchor={anchorRef.current}
					resize={false}
					onClose={() => setModal(false)}
				>
					<div
						style={{
							padding: '1em',
						}}
					>
						<ScInput
							name='product-collection'
							showLabel={false}
							type='search'
							placeholder={__(
								'Search or type a collection name',
								'surecart'
							)}
							value={searchText}
							onScInput={(e) => {
								setSearchText(e?.target?.value);
							}}
						></ScInput>
						<div
							style={{
								marginTop: '1em',
							}}
						>
						<MenuGroup>
							{ collectionPages?.map((page) => {
								return (
								<MenuItem
									iconPosition="left"
									info={ filterURLForDisplay( safeDecodeURI( page?.permalink ), 24 ) }
									shortcut={ 'collection' }
									icon={
										<Icon
											className="block-editor-link-control__search-item-icon"
											icon={ category }
										/>
									}
									onClick={ () => {
										setModal(false);
										setLoadingPage(true);
										setPlaceholderText(
											__('Loading...', 'surecart')
										);
										getCollectionPage(page?.id);
									}}
									className="block-editor-link-control__search-item"
								>
									<TextHighlight
										// The component expects a plain text string.
										text={ stripHTML(page?.name) }
										highlight={ searchText }
									/>
								</MenuItem>
								);
							})}
						</MenuGroup>
						</div>
					</div>
				</Popover>
			)}
		</>
	);
};
