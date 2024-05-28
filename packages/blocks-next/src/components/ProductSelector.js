import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	MenuItem,
	TextHighlight,
	MenuGroup,
	SearchControl,
	Button,
	Spinner,
	Popover,
} from '@wordpress/components';
import { Icon, currencyDollar } from '@wordpress/icons';
import { __unstableStripHTML as stripHTML } from '@wordpress/dom';
import { addQueryArgs } from '@wordpress/url';

export default ({ onProductSelect, currentSelectedIds }) => {
	const anchorRef = useRef(null);
	const [products, setProducts] = useState(null);
	const [searchText, setSearchText] = useState('');
	const [modal, setModal] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!products?.length) {
			getProducts();
		}
	}, []);

	useEffect(() => {
		if (searchText) {
			getProducts();
		}
	}, [searchText]);

	const getProducts = async () => {
		try {
			setLoading(true);
			const products = await apiFetch({
				path: addQueryArgs('/surecart/v1/products', {
					query: searchText,
					archived: false,
					status: ['published'],
				}),
			});

			if (!products) {
				return;
			}
			setProducts(products);
			setLoading(false);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<Button variant="secondary" onClick={() => setModal(true)}>
				{__('Select specific products', 'surecart')}
			</Button>
			{modal && (
				<Popover
					position="overlay"
					shift
					anchor={anchorRef.current}
					resize={false}
					onClose={() => setModal(false)}
					offsetY={1000}
				>
					<div
						style={{
							minWidth: '25em',
							padding: '1em',
						}}
					>
						<SearchControl
							placeholder={__(
								'Search or type a product name',
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

						{!loading && !!products?.length && (
							<div
								style={{
									marginTop: '1em',
								}}
							>
								<MenuGroup>
									{products?.map((product) => {
										return (
											<MenuItem
												iconPosition="left"
												onClick={() => {
													setModal(false);
													onProductSelect(product);
												}}
												className="block-editor-link-control__search-item"
												disabled={currentSelectedIds.includes(
													product.id
												)}
											>
												<TextHighlight
													// The component expects a plain text string.
													text={stripHTML(
														product?.name
													)}
													highlight={searchText}
												/>
											</MenuItem>
										);
									})}
								</MenuGroup>
							</div>
						)}
						{!loading && !products?.length && (
							<div
								style={{
									marginTop: '1em',
								}}
							>
								{__('No products found.', 'surecart')}
							</div>
						)}
					</div>
				</Popover>
			)}
		</div>
	);
};
