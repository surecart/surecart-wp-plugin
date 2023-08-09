/**
 * External dependencies.
 */
import { useEffect, useState } from '@wordpress/element';

export default function ({ product, editProduct, savingProduct }) {
	const [loaded, setLoaded] = useState(false);

	/**
	 * For the first time load, set the loaded to true to keep track of initial stock.
	 */
	useEffect(() => {
		if (
			product?.stock !== undefined && // make sure has stock
			product?.stock_adjustment === undefined && // initially stock_adjustment is undefined
			!loaded
		) {
			setLoaded(true);
		}
	}, [product?.stock, product?.stock_adjustment, loaded]);

	/**
	 * For first time load, set the initial stock.
	 * Also if once product is saved, set the initial stock to the current stock.
	 */
	useEffect(() => {
		if (loaded) {
			editProduct({
				initial_stock: product?.stock || 0,
			});
		}
	}, [loaded]);

	/**
	 * If stock has changed, calculate the stock adjustment.
	 */
	useEffect(() => {
		if (product?.stock !== undefined) {
			editProduct({
				stock_adjustment:
					parseInt(product?.stock) - parseInt(product?.initial_stock),
			});
		}
	}, [product?.stock]);

	/**
	 * If product is saved, set the initial stock to the current stock.
	 */
	useEffect(() => {
		if (savingProduct && product?.stock !== undefined) {
			editProduct({
				initial_stock: product?.stock || 0,
			});
		}
	}, [savingProduct]);
}
