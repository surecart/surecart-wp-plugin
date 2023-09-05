import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect, useRef } from '@wordpress/element';
import { createNavigationLink } from './use-convert-to-navigation-links';
import { useSelect, useDispatch } from '@wordpress/data';
import { Popover, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	MenuItem,
	TextHighlight,
	MenuGroup,
	SearchControl,
} from '@wordpress/components';
import { Icon, category } from '@wordpress/icons';
import { __unstableStripHTML as stripHTML } from '@wordpress/dom';
import {
	safeDecodeURI,
	filterURLForDisplay,
	addQueryArgs,
} from '@wordpress/url';

export default ({ clientId }) => {
	const anchorRef = useRef(null);
	const [collectionPage, setCollectionPage] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [modal, setModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [placeholderText, setPlaceholderText] = useState(
		__('Select Collection Page', 'surecart')
	);
	const [collectionPages, setCollectionPages] = useState([]);

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
		if (!collectionPages?.length) {
			getCollectionPages();
		}
	}, []);

	useEffect(() => {
		if (searchText) {
			getCollectionPages();
		}
	}, [searchText]);

	const getCollectionPage = async (id) => {
		try {
			const collectionPage = await apiFetch({
				path: `/surecart/v1/product_collections/${id}`,
			});
			if (!collectionPage) {
				return;
			}
			setCollectionPage(collectionPage);
			useConvertToNavigationLinks({
				clientId,
				collectionPage,
				parentClientId,
			});
		} catch (e) {
			console.error(e);
		}
	};

	const getCollectionPages = async () => {
		try {
			setLoading(true);
			const pages = await apiFetch({
				path: addQueryArgs('/surecart/v1/product_collections', {
					query: searchText,
				}),
			});
			if (!pages) {
				return;
			}
			setCollectionPages(pages);
			setLoading(false);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
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
							minWidth: '25em',
							padding: '1em',
						}}
					>
						<SearchControl
							placeholder={__(
								'Search or type a collection name',
								'surecart'
							)}
							value={searchText}
							onChange={setSearchText}
						/>

						{loading && (
							<div
								style={{
									marginTop: '1em',
									textAlign: 'center',
								}}
							>
								<Spinner />
							</div>
						)}

						{!loading && !!collectionPages?.length && (
							<div
								style={{
									marginTop: '1em',
								}}
							>
								<MenuGroup>
									{collectionPages?.map((page) => {
										return (
											<MenuItem
												iconPosition="left"
												info={filterURLForDisplay(
													safeDecodeURI(
														page?.permalink
													),
													24
												)}
												shortcut={'collection'}
												icon={
													<Icon
														className="block-editor-link-control__search-item-icon"
														icon={category}
													/>
												}
												onClick={() => {
													setModal(false);
													setLoadingPage(true);
													setPlaceholderText(
														__(
															'Loading...',
															'surecart'
														)
													);
													getCollectionPage(page?.id);
												}}
												className="block-editor-link-control__search-item"
											>
												<TextHighlight
													// The component expects a plain text string.
													text={stripHTML(page?.name)}
													highlight={searchText}
												/>
											</MenuItem>
										);
									})}
								</MenuGroup>
							</div>
						)}
						{!loading && !collectionPages?.length && (
							<div
								style={{
									marginTop: '1em',
								}}
							>
								{__('No collections found.', 'surecart')}
							</div>
						)}
					</div>
				</Popover>
			)}
		</>
	);
};
